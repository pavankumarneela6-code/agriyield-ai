from pathlib import Path
import logging
import math

import joblib
import pandas as pd

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from database import get_db_connection
import traceback



# =========================================================
# 1. CONFIGURATION
# =========================================================

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/ml",
    tags=["Machine Learning"],
)

MODEL_PATH = (
    Path(__file__).resolve().parents[1]
    / "ridge_temperature_model.joblib"
)

MODEL_ARTIFACT = None

EXPECTED_FEATURES = [
    "roni_value",
    "roni_previous_season",
    "temperature_anomaly_3month_c",
    "temperature_anomaly_previous_season_c",
    "precipitation_anomaly_3month_mm",
    "humidity_anomaly_pp",
    "wind_anomaly_kmh",
    "season_sin",
    "season_cos",
]


# =========================================================
# 2. LOAD TRAINED MODEL
# =========================================================

def load_temperature_model():
    """
    Load the previously trained Ridge Regression model.

    The FastAPI application can start even if the model file
    is unavailable. Prediction endpoints return HTTP 503
    until the model can be loaded.
    """

    global MODEL_ARTIFACT

    try:
        if not MODEL_PATH.exists():
            logger.error(
                "Temperature model file not found: %s",
                MODEL_PATH,
            )
            MODEL_ARTIFACT = None
            return

        artifact = joblib.load(MODEL_PATH)

        if not isinstance(artifact, dict):
            raise ValueError(
                "Invalid model artifact format."
            )

        if "model" not in artifact:
            raise ValueError(
                "The artifact does not contain a trained model."
            )

        if "feature_columns" not in artifact:
            raise ValueError(
                "The artifact does not contain feature metadata."
            )

        if artifact["feature_columns"] != EXPECTED_FEATURES:
            raise ValueError(
                "Model feature columns do not match the API."
            )

        MODEL_ARTIFACT = artifact

        logger.info(
            "Temperature model loaded successfully from %s",
            MODEL_PATH,
        )

    except Exception:
        MODEL_ARTIFACT = None
        logger.exception(
            "Failed to load the temperature prediction model."
        )


# Load once when this module is imported.
load_temperature_model()


# =========================================================
# 3. REQUEST VALIDATION
# =========================================================

class TemperaturePredictionRequest(BaseModel):
    """
    Input features required by the trained Ridge model.

    Anomaly values and RONI must use the same definitions
    and units used during model training.
    """

    roni_value: float = Field(
        ...,
        allow_inf_nan=False,
        description="Current selected season's RONI value.",
    )

    roni_previous_season: float = Field(
        ...,
        allow_inf_nan=False,
        description="Previous selected season's RONI value.",
    )

    temperature_anomaly_3month_c: float = Field(
        ...,
        allow_inf_nan=False,
        description="Current season's temperature anomaly in °C.",
    )

    temperature_anomaly_previous_season_c: float = Field(
        ...,
        allow_inf_nan=False,
        description="Previous season's temperature anomaly in °C.",
    )

    precipitation_anomaly_3month_mm: float = Field(
        ...,
        allow_inf_nan=False,
        description="Current season's precipitation anomaly in mm.",
    )

    humidity_anomaly_pp: float = Field(
        ...,
        allow_inf_nan=False,
        description="Current season's humidity anomaly in percentage points.",
    )

    wind_anomaly_kmh: float = Field(
        ...,
        allow_inf_nan=False,
        description="Current season's wind-speed anomaly in km/h.",
    )

    season_month: int = Field(
        ...,
        ge=1,
        le=12,
        description="Month number of the current season's center month.",
    )


# =========================================================
# 4. MODEL STATUS ENDPOINT
# =========================================================

@router.get("/temperature/status")
def temperature_model_status():
    """
    Check whether the trained temperature model is available.
    """

    if MODEL_ARTIFACT is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Temperature prediction model is unavailable. "
                "Check the model file and backend logs."
            ),
        )

    return {
        "success": True,
        "model": "Ridge Regression",
        "model_loaded": True,
        "model_file": MODEL_PATH.name,
        "baseline_period": MODEL_ARTIFACT.get(
            "baseline_period",
            "1981-2010",
        ),
        "selected_alpha": MODEL_ARTIFACT.get(
            "selected_alpha"
        ),
        "target": MODEL_ARTIFACT.get(
            "target",
            "next_season_temperature_anomaly_c",
        ),
    }


# =========================================================
# 5. TEMPERATURE PREDICTION ENDPOINT
# =========================================================

@router.post("/temperature/predict")
def predict_temperature_anomaly(
    request: TemperaturePredictionRequest,
):
    """
    Predict the next selected season's temperature anomaly.

    This endpoint accepts features in the request body.
    It does not automatically retrieve the latest observations
    from PostgreSQL.
    """

    # Check model availability.
    if MODEL_ARTIFACT is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Temperature model is unavailable. "
                "Check that ridge_temperature_model.joblib "
                "exists in the backend folder."
            ),
        )

    # -----------------------------------------------------
    # A. PREPARE FEATURES
    # -----------------------------------------------------

    month = request.season_month

    features = {
        "roni_value": request.roni_value,

        "roni_previous_season":
            request.roni_previous_season,

        "temperature_anomaly_3month_c":
            request.temperature_anomaly_3month_c,

        "temperature_anomaly_previous_season_c":
            request.temperature_anomaly_previous_season_c,

        "precipitation_anomaly_3month_mm":
            request.precipitation_anomaly_3month_mm,

        "humidity_anomaly_pp":
            request.humidity_anomaly_pp,

        "wind_anomaly_kmh":
            request.wind_anomaly_kmh,

        "season_sin": math.sin(
            2 * math.pi * month / 12
        ),

        "season_cos": math.cos(
            2 * math.pi * month / 12
        ),
    }

    # -----------------------------------------------------
    # B. MATCH TRAINING FEATURE ORDER
    # -----------------------------------------------------

    feature_columns = MODEL_ARTIFACT["feature_columns"]
    model = MODEL_ARTIFACT["model"]

    missing_features = [
        column
        for column in feature_columns
        if column not in features
    ]

    if missing_features:
        logger.error(
            "Required model features are missing: %s",
            missing_features,
        )

        raise HTTPException(
            status_code=500,
            detail="The trained model has incompatible features.",
        )

    try:
        # Preserve the same column names and ordering used
        # during model training.
        input_df = pd.DataFrame(
            [
                {
                    column: features[column]
                    for column in feature_columns
                }
            ],
            columns=feature_columns,
        )

        # -------------------------------------------------
        # C. GENERATE PREDICTION
        # -------------------------------------------------

        prediction = float(
            model.predict(input_df)[0]
        )

        if not math.isfinite(prediction):
            raise ValueError(
                "The model returned an invalid prediction."
            )

    except Exception as error:
        logger.exception(
            "Temperature anomaly prediction failed."
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to generate the temperature prediction.",
        ) from error

    # -----------------------------------------------------
    # D. RETURN API RESPONSE
    # -----------------------------------------------------

    return {
        "success": True,
        "model": "Ridge Regression",
        "predicted_temperature_anomaly_c": round(
            prediction,
            3,
        ),
        "unit": "°C",
        "target": (
            "Next selected season's temperature anomaly"
        ),
        "baseline_period": MODEL_ARTIFACT.get(
            "baseline_period",
            "1981-2010",
        ),
        "selected_alpha": MODEL_ARTIFACT.get(
            "selected_alpha"
        ),
        "model_test_mae_c": 0.3241,
        "model_test_rmse_c": 0.3945,
        "model_test_r2": 0.0798,
        "note": (
            "Experimental estimate based on a historical "
            "Ridge Regression model. It is not an official "
            "weather forecast. Performance may vary."
        ),
    }
    
@router.get("/temperature/latest-inputs")
def get_latest_temperature_inputs(location_id: int = 1):
    """
    Generate Ridge Regression inputs from historical ERA5 weather
    and RONI observations using the 1981-2010 seasonal baseline.
    """

    connection = None

    query = """
    WITH daily AS (
        SELECT
            EXTRACT(YEAR FROM observation_date)::int AS season_year,
            EXTRACT(MONTH FROM observation_date)::int AS month_num,
            observation_date,
            temperature_c,
            precipitation_mm,
            humidity_percent,
            wind_speed_kmh

        FROM historical_weather_observations

        WHERE location_id = %s
          AND model_name = 'era5'
          AND temperature_c IS NOT NULL
          AND precipitation_mm IS NOT NULL
          AND humidity_percent IS NOT NULL
          AND wind_speed_kmh IS NOT NULL
    ),

    monthly_climatology AS (
        SELECT
            month_num,
            AVG(temperature_c) AS baseline_temp,
            AVG(precipitation_mm) AS baseline_precip_daily,
            AVG(humidity_percent) AS baseline_humidity,
            AVG(wind_speed_kmh) AS baseline_wind

        FROM daily

        WHERE observation_date >= DATE '1981-01-01'
          AND observation_date < DATE '2011-01-01'

        GROUP BY month_num
    ),

    daily_anomalies AS (
        SELECT
            d.season_year,
            d.month_num,
            d.observation_date,

            d.temperature_c - c.baseline_temp
                AS temperature_anomaly_daily,

            d.precipitation_mm - c.baseline_precip_daily
                AS precipitation_anomaly_daily,

            d.humidity_percent - c.baseline_humidity
                AS humidity_anomaly_daily,

            d.wind_speed_kmh - c.baseline_wind
                AS wind_anomaly_daily

        FROM daily d

        JOIN monthly_climatology c
          ON c.month_num = d.month_num
    ),

    seasonal_raw AS (
        SELECT
            season_year,

            CASE
                WHEN month_num BETWEEN 1 AND 3 THEN 'JFM'
                WHEN month_num BETWEEN 4 AND 6 THEN 'AMJ'
                WHEN month_num BETWEEN 7 AND 9 THEN 'JAS'
                ELSE 'OND'
            END AS season_label,

            COUNT(*) AS days_observed,
            COUNT(DISTINCT observation_date) AS unique_days,

            AVG(temperature_anomaly_daily)
                AS temperature_anomaly_3month_c,

            SUM(precipitation_anomaly_daily)
                AS precipitation_anomaly_3month_mm,

            AVG(humidity_anomaly_daily)
                AS humidity_anomaly_pp,

            AVG(wind_anomaly_daily)
                AS wind_anomaly_kmh

        FROM daily_anomalies

        GROUP BY
            season_year,

            CASE
                WHEN month_num BETWEEN 1 AND 3 THEN 'JFM'
                WHEN month_num BETWEEN 4 AND 6 THEN 'AMJ'
                WHEN month_num BETWEEN 7 AND 9 THEN 'JAS'
                ELSE 'OND'
            END
    ),

    complete_seasons AS (
        SELECT *
        FROM seasonal_raw s

        WHERE days_observed = CASE
            WHEN season_label = 'JFM'
             AND (
                 season_year %% 400 = 0
                 OR (
                     season_year %% 4 = 0
                     AND season_year %% 100 <> 0
                 )
             )
                THEN 91

            WHEN season_label = 'JFM' THEN 90
            WHEN season_label = 'AMJ' THEN 91
            ELSE 92
        END

        AND unique_days = days_observed
    ),

    seasonal_features AS (
        SELECT
            s.season_year,
            s.season_label,
            r.center_month,

            r.index_value_c::double precision AS roni_value,

            s.temperature_anomaly_3month_c,

            s.precipitation_anomaly_3month_mm,

            s.humidity_anomaly_pp,

            s.wind_anomaly_kmh

        FROM complete_seasons s

        JOIN enso_index_observations r
          ON r.season_year = s.season_year
         AND r.season_label = s.season_label
         AND r.index_name = 'RONI'

        WHERE s.season_label IN ('JFM', 'AMJ', 'JAS', 'OND')
    ),

    lagged AS (
        SELECT
            *,

            LAG(center_month) OVER (
                ORDER BY center_month
            ) AS previous_center_month,

            LAG(roni_value) OVER (
                ORDER BY center_month
            ) AS roni_previous_season,

            LAG(temperature_anomaly_3month_c) OVER (
                ORDER BY center_month
            ) AS temperature_anomaly_previous_season_c

        FROM seasonal_features
    )

    SELECT
        season_year,
        season_label,
        center_month,
        roni_value,
        roni_previous_season,
        temperature_anomaly_3month_c,
        temperature_anomaly_previous_season_c,
        precipitation_anomaly_3month_mm,
        humidity_anomaly_pp,
        wind_anomaly_kmh,
        previous_center_month

    FROM lagged

    WHERE previous_center_month =
          (center_month - INTERVAL '3 months')::date

    ORDER BY center_month DESC

    LIMIT 1;
    """

    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            cursor.execute(query, (location_id,))
            row = cursor.fetchone()

        if not row:
            raise HTTPException(
                status_code=404,
                detail=(
                    "No complete seasonal weather and RONI data "
                    "with a consecutive previous season was found."
                ),
            )

        (
            season_year,
            season_label,
            center_month,
            roni_value,
            roni_previous_season,
            temperature_anomaly_3month_c,
            temperature_anomaly_previous_season_c,
            precipitation_anomaly_3month_mm,
            humidity_anomaly_pp,
            wind_anomaly_kmh,
            previous_center_month,
        ) = row

        next_season_map = {
            "JFM": ("AMJ", season_year, 5),
            "AMJ": ("JAS", season_year, 8),
            "JAS": ("OND", season_year, 11),
            "OND": ("JFM", season_year + 1, 2),
        }

        target_label, target_year, target_month = (
            next_season_map[season_label]
        )

        return {
            "success": True,
            "location_id": location_id,
            "weather_source": "ERA5",
            "roni_source": "RONI",
            "baseline_period": "1981-2010",
            "latest_available_season": {
                "year": season_year,
                "label": season_label,
                "center_month": center_month.isoformat(),
                "previous_center_month": (
                    previous_center_month.isoformat()
                ),
            },
            "target_season": {
                "year": target_year,
                "label": target_label,
                "center_month": (
                    f"{target_year}-{target_month:02d}-01"
                ),
            },
            "inputs": {
                "roni_value": float(roni_value),
                "roni_previous_season": float(
                    roni_previous_season
                ),
                "temperature_anomaly_3month_c": float(
                    temperature_anomaly_3month_c
                ),
                "temperature_anomaly_previous_season_c": float(
                    temperature_anomaly_previous_season_c
                ),
                "precipitation_anomaly_3month_mm": float(
                    precipitation_anomaly_3month_mm
                ),
                "humidity_anomaly_pp": float(humidity_anomaly_pp),
                "wind_anomaly_kmh": float(wind_anomaly_kmh),
                "season_month": center_month.month,
            },
            "note": (
                "Inputs are derived from the latest available "
                "complete ERA5 season and matching RONI data. "
                "The estimate is experimental, not an official "
                "weather forecast."
            ),
        }

    except HTTPException:
        raise

    except Exception as error:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Could not generate prediction inputs: {error}",
        ) from error
    finally:
        if connection is not None:
            connection.close()    
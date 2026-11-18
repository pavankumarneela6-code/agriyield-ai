from fastapi import APIRouter, Depends, HTTPException
from statistics import mean

from database import get_db_connection
from routes.auth_routes import get_current_user


router = APIRouter(
    prefix="/api/climate",
    tags=["Regional Climate Risk"]
)


def classify_rainfall_deficit(deficit):
    if deficit < 10:
        return "Low"
    elif deficit < 20:
        return "Moderate"
    elif deficit < 30:
        return "High"
    return "Severe"


def classify_temperature_anomaly(anomaly):
    if anomaly < 0.5:
        return "Normal"
    elif anomaly < 1.0:
        return "Moderate"
    elif anomaly < 1.5:
        return "High"
    return "Severe"


@router.get("/{location_id}/regional-risk")
def get_regional_climate_risk(
    location_id: int,
    start_year: int = 2020,
    end_year: int = 2025,
    current_user: dict = Depends(get_current_user),
):

    if not (1900 <= start_year < end_year <= 2100):
        raise HTTPException(
            status_code=422,
            detail="Invalid year range."
        )

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # =========================================
        # STEP 1: VERIFY LOCATION OWNERSHIP
        # =========================================

        cursor.execute(
            """
            SELECT
                location_id,
                location_name,
                state,
                country
            FROM public.user_locations
            WHERE location_id = %s
              AND user_id = %s
            """,
            (
                location_id,
                current_user["user_id"]
            )
        )

        location = cursor.fetchone()

        if location is None:
            raise HTTPException(
                status_code=404,
                detail="Location not found."
            )

        # =========================================
        # STEP 2: GET YEARLY HISTORICAL DATA
        # =========================================

        cursor.execute(
            """
            SELECT
                EXTRACT(YEAR FROM observation_date)::INTEGER,
                COUNT(DISTINCT observation_date),
                ROUND(AVG(temperature_c), 2),
                ROUND(SUM(precipitation_mm), 2),
                ROUND(MAX(temperature_c), 2)
            FROM public.historical_weather_observations
            WHERE location_id = %s
              AND observation_date >= %s
              AND observation_date < %s
              AND source = %s
              AND model_name = %s
            GROUP BY EXTRACT(YEAR FROM observation_date)
            ORDER BY 1 ASC
            """,
            (
                location_id,
                f"{start_year}-01-01",
                f"{end_year + 1}-01-01",
                "Open-Meteo Historical Weather API",
                "era5"
            )
        )

        rows = cursor.fetchall()

        yearly_records = []

        for row in rows:
            yearly_records.append({
                "year": int(row[0]),
                "total_days": int(row[1]),
                "average_temperature_c": (
                    float(row[2]) if row[2] is not None else None
                ),
                "total_rainfall_mm": (
                    float(row[3]) if row[3] is not None else None
                ),
                "maximum_temperature_c": (
                    float(row[4]) if row[4] is not None else None
                )
            })

        # =========================================
        # STEP 3: VALIDATE DATA AVAILABILITY
        # =========================================

        if len(yearly_records) < 3:
            return {
                "success": True,
                "data_available": False,
                "message": (
                    "At least three years of historical "
                    "data are required for this assessment."
                ),
                "location": {
                    "location_id": location[0],
                    "location_name": location[1],
                    "state": location[2],
                    "country": location[3]
                },
                "available_years": len(yearly_records),
                "records": yearly_records
            }

        valid_records = [
            record for record in yearly_records
            if record["total_rainfall_mm"] is not None
            and record["average_temperature_c"] is not None
        ]

        if len(valid_records) < 3:
            raise HTTPException(
                status_code=422,
                detail="Insufficient valid rainfall and temperature data."
            )

        # =========================================
        # STEP 4: SELECT LATEST YEAR AND BASELINE
        # =========================================

        latest_record = valid_records[-1]

        baseline_records = [
            record for record in valid_records
            if record["year"] < latest_record["year"]
        ]

        if len(baseline_records) < 2:
            raise HTTPException(
                status_code=422,
                detail="Insufficient historical baseline data."
            )

        baseline_rainfall = mean(
            record["total_rainfall_mm"]
            for record in baseline_records
        )

        baseline_temperature = mean(
            record["average_temperature_c"]
            for record in baseline_records
        )

        latest_rainfall = latest_record["total_rainfall_mm"]
        latest_temperature = latest_record["average_temperature_c"]

        # =========================================
        # STEP 5: RAINFALL DEFICIT
        # =========================================

        if baseline_rainfall > 0:

            rainfall_deficit = (
                (baseline_rainfall - latest_rainfall)
                / baseline_rainfall
            ) * 100

        else:
            rainfall_deficit = None

        if rainfall_deficit is not None:

            rainfall_deficit = round(
                rainfall_deficit, 2
            )

            rainfall_condition = classify_rainfall_deficit(
                rainfall_deficit
            )

        else:
            rainfall_condition = "Unavailable"

        # =========================================
        # STEP 6: TEMPERATURE ANOMALY
        # =========================================

        temperature_anomaly = round(
            latest_temperature - baseline_temperature,
            2
        )

        temperature_condition = classify_temperature_anomaly(
            temperature_anomaly
        )

        # =========================================
        # STEP 7: OVERALL CLIMATE ASSESSMENT
        # =========================================

        severity_order = {
            "Normal": 0,
            "Low": 0,
            "Moderate": 1,
            "High": 2,
            "Severe": 3
        }

        conditions = [
            rainfall_condition,
            temperature_condition
        ]

        available_conditions = [
            condition for condition in conditions
            if condition in severity_order
        ]

        overall_level = (
            max(
                available_conditions,
                key=lambda item: severity_order[item]
            )
            if available_conditions
            else "Unavailable"
        )

        # =========================================
        # STEP 8: RESPONSE
        # =========================================

        return {
            "success": True,
            "data_available": True,

            "location": {
                "location_id": location[0],
                "location_name": location[1],
                "state": location[2],
                "country": location[3]
            },

            "assessment_period": {
                "start_year": start_year,
                "end_year": end_year,
                "latest_observation_year": latest_record["year"]
            },

            "baseline": {
                "period": (
                    f"{baseline_records[0]['year']}-"
                    f"{baseline_records[-1]['year']}"
                ),
                "years_used": len(baseline_records),
                "average_annual_rainfall_mm": round(
                    baseline_rainfall, 2
                ),
                "average_temperature_c": round(
                    baseline_temperature, 2
                )
            },

            "latest_observation": {
                "year": latest_record["year"],
                "annual_rainfall_mm": latest_rainfall,
                "average_temperature_c": latest_temperature,
                "maximum_temperature_c": (
                    latest_record["maximum_temperature_c"]
                )
            },

            "regional_indicators": {

                "rainfall_deficit": {
                    "value_percent": rainfall_deficit,
                    "condition": rainfall_condition,
                    "description": (
                        "Annual rainfall reduction compared "
                        "with the selected historical baseline."
                    )
                },

                "temperature_anomaly": {
                    "value_c": temperature_anomaly,
                    "condition": temperature_condition,
                    "description": (
                        "Difference between latest annual "
                        "average temperature and baseline average."
                    )
                }
            },

            "overall_climate_assessment": {
                "level": overall_level,
                "method": "Highest indicator severity",
                "probability_percent": None
            },

            "data_source": {
                "provider": "Open-Meteo Historical Weather API",
                "model": "ERA5",
                "data_type": "Historical reanalysis"
            },

            "methodology_note": (
                "This is a historical comparison, not an official "
                "drought declaration, heatwave warning, or "
                "probabilistic forecast. The baseline uses the "
                "available preceding years in the selected period."
            ),

            "historical_records": yearly_records
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Regional Climate Risk Error:", str(error))

        raise HTTPException(
            status_code=500,
            detail="Unable to calculate regional climate indicators."
        ) from error

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()
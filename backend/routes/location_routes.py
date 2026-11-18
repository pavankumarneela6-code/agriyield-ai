from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal

from datetime import date,datetime
from zoneinfo import ZoneInfo

from database import get_db_connection
from routes.auth_routes import get_current_user
from services.weather_service import (
    get_current_weather,
    fetch_and_save_historical_weather
)

router = APIRouter(
    prefix="/api/locations",
    tags=["Location Management"]
)


class LocationCreate(BaseModel):
    location_name: str = Field(min_length=2, max_length=150)
    state: Optional[str] = Field(default=None, max_length=100)
    country: str = Field(default="India", min_length=2, max_length=100)
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)
    is_default: bool = False


def get_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
):
    # Reuse the existing authentication function.
    return credentials


@router.post("/")
def add_location(
    location: LocationCreate,
    current_user: dict = Depends(get_current_user),
):
    connection = None
    cursor = None

    try:
        user_id = current_user["user_id"]
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT location_id FROM user_locations WHERE user_id = %s",
            (user_id,)
        )
        existing_locations = cursor.fetchall()

        make_default = location.is_default or len(existing_locations) == 0

        if make_default:
            cursor.execute(
                """
                UPDATE user_locations
                SET is_default = FALSE
                WHERE user_id = %s
                """,
                (user_id,)
            )

        cursor.execute(
            """
            INSERT INTO user_locations (
                user_id,
                location_name,
                state,
                country,
                latitude,
                longitude,
                is_default
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING location_id, location_name, state, country,
                      latitude, longitude, is_default, created_at
            """,
            (
                user_id,
                location.location_name.strip(),
                location.state,
                location.country.strip(),
                location.latitude,
                location.longitude,
                make_default,
            )
        )

        row = cursor.fetchone()
        connection.commit()

        return {
            "success": True,
            "message": "Location added successfully.",
            "location": {
                "location_id": row[0],
                "location_name": row[1],
                "state": row[2],
                "country": row[3],
                "latitude": float(row[4]) if row[4] is not None else None,
                "longitude": float(row[5]) if row[5] is not None else None,
                "is_default": row[6],
                "created_at": row[7].isoformat() if row[7] else None,
            }
        }

    except Exception:
        if connection:
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to save location. Check the server logs."
        )

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@router.get("/")
def get_locations(
    current_user: dict = Depends(get_current_user),
):
    connection = None
    cursor = None

    try:
        user_id = current_user["user_id"]
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT location_id, location_name, state, country,
                   latitude, longitude, is_default, created_at
            FROM user_locations
            WHERE user_id = %s
            ORDER BY is_default DESC, created_at DESC
            """,
            (user_id,)
        )

        rows = cursor.fetchall()

        locations = [
            {
                "location_id": row[0],
                "location_name": row[1],
                "state": row[2],
                "country": row[3],
                "latitude": float(row[4]) if row[4] is not None else None,
                "longitude": float(row[5]) if row[5] is not None else None,
                "is_default": row[6],
                "created_at": row[7].isoformat() if row[7] else None,
            }
            for row in rows
        ]

        return {
            "success": True,
            "count": len(locations),
            "locations": locations,
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve locations. Check the server logs."
        )

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@router.put("/{location_id}/default")
def set_default_location(
    location_id: int,
    current_user: dict = Depends(get_current_user),
):
    connection = None
    cursor = None

    try:
        user_id = current_user["user_id"]
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT location_id
            FROM user_locations
            WHERE location_id = %s AND user_id = %s
            """,
            (location_id, user_id)
        )

        if cursor.fetchone() is None:
            raise HTTPException(
                status_code=404,
                detail="Location not found for this user."
            )

        cursor.execute(
            """
            UPDATE user_locations
            SET is_default = FALSE
            WHERE user_id = %s
            """,
            (user_id,)
        )

        cursor.execute(
            """
            UPDATE user_locations
            SET is_default = TRUE
            WHERE location_id = %s AND user_id = %s
            """,
            (location_id, user_id)
        )

        connection.commit()

        return {
            "success": True,
            "message": "Default location updated successfully.",
            "location_id": location_id,
        }

    except HTTPException:
        if connection:
            connection.rollback()
        raise

    except Exception:
        if connection:
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to update default location."
        )

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@router.get("/{location_id}/weather")
def get_location_weather(
    location_id: int,
    current_user: dict = Depends(get_current_user),
):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Get the requested location belonging to this user.
        cursor.execute(
            """
            SELECT location_id, location_name, state, country,
                   latitude, longitude
            FROM user_locations
            WHERE location_id = %s AND user_id = %s
            """,
            (location_id, current_user["user_id"]),
        )

        location = cursor.fetchone()

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve the saved location.",
        ) from error

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    if location is None:
        raise HTTPException(
            status_code=404,
            detail="Location not found for this user.",
        )

    latitude = location[4]
    longitude = location[5]

    if latitude is None or longitude is None:
        raise HTTPException(
            status_code=422,
            detail="The selected location has no coordinates.",
        )

    try:
        weather = get_current_weather(
            latitude=float(latitude),
            longitude=float(longitude),
        )

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error),
        ) from error

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        ) from error
        
        # Convert the provider's local observation time
    # into a timezone-aware datetime.
    try:
        observed_at = datetime.fromisoformat(
            weather["updated_at"]
        )

        timezone_name = weather.get("timezone") or "UTC"

        if observed_at.tzinfo is None:
            observed_at = observed_at.replace(
                tzinfo=ZoneInfo(timezone_name)
            )

        save_connection = None
        save_cursor = None

        try:
            save_connection = get_db_connection()
            save_cursor = save_connection.cursor()

            save_cursor.execute(
                """
                INSERT INTO weather_observations (
                    location_id,
                    observed_at,
                    temperature_c,
                    humidity_percent,
                    precipitation_mm,
                    wind_speed_kmh,
                    weather_code,
                    source
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)

                ON CONFLICT (
                    location_id,
                    observed_at,
                    source
                )
                DO UPDATE SET
                    temperature_c = EXCLUDED.temperature_c,
                    humidity_percent = EXCLUDED.humidity_percent,
                    precipitation_mm = EXCLUDED.precipitation_mm,
                    wind_speed_kmh = EXCLUDED.wind_speed_kmh,
                    weather_code = EXCLUDED.weather_code

                RETURNING observation_id;
                """,
                (
                    location[0],
                    observed_at,
                    weather.get("temperature"),
                    weather.get("humidity"),
                    weather.get("precipitation"),
                    weather.get("wind_speed"),
                    weather.get("weather_code"),
                    weather.get("source", "Open-Meteo"),
                ),
            )

            observation_id = save_cursor.fetchone()[0]
            save_connection.commit()

        finally:
            if save_cursor:
                save_cursor.close()

            if save_connection:
                save_connection.close()

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Weather was fetched, but saving it to the database failed.",
        ) from error   
    return {
        "success": True,
        "location": {
            "location_id": location[0],
            "location_name": location[1],
            "state": location[2],
            "country": location[3],
            "latitude": float(latitude),
            "longitude": float(longitude),
        },
        "weather": weather,
        "observation_id": observation_id,
    } 
@router.get("/{location_id}/historical-weather")
def get_location_historical_weather(
    location_id: int,
    start_date: date,
    end_date: date,
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve historical weather for the selected user location.

    If records are missing, fetch them from Open-Meteo
    and save them before returning the data.
    """

    if start_date > end_date:
        raise HTTPException(
            status_code=422,
            detail="Start date cannot be after end date.",
        )

    connection = None
    cursor = None

    try:
        # =============================================
        # STEP 1: VERIFY LOCATION OWNERSHIP
        # =============================================

        connection = get_db_connection()
        cursor = connection.cursor()

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
                current_user["user_id"],
            ),
        )

        location = cursor.fetchone()

        if location is None:
            raise HTTPException(
                status_code=404,
                detail="Location not found for this user.",
            )

        # =============================================
        # STEP 2: CHECK HISTORICAL DATA COVERAGE
        # =============================================

        cursor.execute(
            """
            SELECT COUNT(DISTINCT observation_date)
            FROM public.historical_weather_observations
            WHERE location_id = %s
              AND observation_date BETWEEN %s AND %s
            """,
            (
                location_id,
                start_date,
                end_date,
            ),
        )

        available_days = cursor.fetchone()[0]

        expected_days = (
            end_date - start_date
        ).days + 1

        # Close the current DB connection before
        # calling the weather fetching service.

        cursor.close()
        cursor = None

        connection.close()
        connection = None

        # =============================================
        # STEP 3: FETCH MISSING HISTORICAL DATA
        # =============================================

        if available_days < expected_days:

            fetch_result = fetch_and_save_historical_weather(
                location_id=location_id,
                start_date=start_date.isoformat(),
                end_date=end_date.isoformat(),
                user_id=current_user["user_id"]
            )

            if not fetch_result.get("success", False):
                raise HTTPException(
                    status_code=502,
                    detail="Unable to fetch historical weather data.",
                )

        # =============================================
        # STEP 4: RETRIEVE SAVED HISTORICAL DATA
        # =============================================

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                observation_date,
                temperature_c,
                humidity_percent,
                precipitation_mm,
                wind_speed_kmh,
                weather_code,
                source,
                model_name
            FROM public.historical_weather_observations
            WHERE location_id = %s
              AND observation_date BETWEEN %s AND %s
            ORDER BY observation_date ASC
            """,
            (
                location_id,
                start_date,
                end_date,
            ),
        )

        rows = cursor.fetchall()

        # =============================================
        # STEP 5: FORMAT RESPONSE
        # =============================================

        records = []

        for row in rows:
            records.append({
                "date": row[0].isoformat(),

                "temperature_c": (
                    float(row[1])
                    if row[1] is not None else None
                ),

                "humidity_percent": (
                    float(row[2])
                    if row[2] is not None else None
                ),

                "precipitation_mm": (
                    float(row[3])
                    if row[3] is not None else None
                ),

                "wind_speed_kmh": (
                    float(row[4])
                    if row[4] is not None else None
                ),

                "weather_code": row[5],
                "source": row[6],
                "model_name": row[7],
            })

        return {
            "success": True,

            "location": {
                "location_id": location[0],
                "location_name": location[1],
                "state": location[2],
                "country": location[3],
            },

            "period": {
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
            },

            "count": len(records),
            "records": records,
        }

    except HTTPException:
        raise

    except Exception as error:
        print(
            "Historical Weather Error:",
            str(error),
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve historical weather data.",
        ) from error

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()
            
@router.get("/{location_id}/yearly-summary")
def get_yearly_climate_summary(
    location_id: int,
    start_year: int = 2020,
    end_year: int = 2025,
    current_user: dict = Depends(get_current_user),
):
    """Return yearly ERA5 climate summaries for an owned location."""

    if not (1900 <= start_year <= end_year <= 2100):
        raise HTTPException(
            status_code=422,
            detail="Invalid year range.",
        )

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Verify location ownership.
        cursor.execute(
            """
            SELECT location_id, location_name, state, country
            FROM public.user_locations
            WHERE location_id = %s
              AND user_id = %s
            """,
            (location_id, current_user["user_id"]),
        )

        location = cursor.fetchone()

        if location is None:
            raise HTTPException(
                status_code=404,
                detail="Location not found for this user.",
            )

        # Calculate yearly summaries from real stored ERA5 records.
        cursor.execute(
            """
            SELECT
                EXTRACT(YEAR FROM observation_date)::INTEGER AS year,
                COUNT(*) AS total_days,
                ROUND(AVG(temperature_c), 2) AS average_temperature_c,
                ROUND(MAX(temperature_c), 2) AS maximum_temperature_c,
                ROUND(MIN(temperature_c), 2) AS minimum_temperature_c,
                ROUND(AVG(humidity_percent), 2) AS average_humidity_percent,
                ROUND(SUM(precipitation_mm), 2) AS total_precipitation_mm,
                ROUND(AVG(wind_speed_kmh), 2) AS average_daily_max_wind_kmh
            FROM public.historical_weather_observations
            WHERE location_id = %s
              AND observation_date >= %s
              AND observation_date < %s
              AND source = %s
              AND model_name = %s
            GROUP BY EXTRACT(YEAR FROM observation_date)
            ORDER BY year ASC
            """,
            (
                location_id,
                date(start_year, 1, 1),
                date(end_year + 1, 1, 1),
                "Open-Meteo Historical Weather API",
                "era5",
            ),
        )

        rows = cursor.fetchall()

        yearly_records = [
            {
                "year": row[0],
                "total_days": row[1],
                "average_temperature_c": (
                    float(row[2]) if row[2] is not None else None
                ),
                "maximum_temperature_c": (
                    float(row[3]) if row[3] is not None else None
                ),
                "minimum_temperature_c": (
                    float(row[4]) if row[4] is not None else None
                ),
                "average_humidity_percent": (
                    float(row[5]) if row[5] is not None else None
                ),
                "total_precipitation_mm": (
                    float(row[6]) if row[6] is not None else None
                ),
                "average_daily_max_wind_kmh": (
                    float(row[7]) if row[7] is not None else None
                ),
            }
            for row in rows
        ]

        return {
            "success": True,
            "location": {
                "location_id": location[0],
                "location_name": location[1],
                "state": location[2],
                "country": location[3],
            },
            "period": {
                "start_year": start_year,
                "end_year": end_year,
            },
            "source": "Open-Meteo Historical Weather API",
            "model": "era5",
            "count": len(yearly_records),
            "records": yearly_records,
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to calculate yearly climate summaries.",
        ) from error

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()    
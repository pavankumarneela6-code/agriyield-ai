import json
import math
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from datetime import date,timedelta
from database import get_db_connection


def _fetch_json(url: str, timeout: int = 20) -> dict | list:
    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "ElNinoAI/1.0"
        }
    )

    with urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def _haversine_distance(lat1, lon1, lat2, lon2):
    radius = 6371

    lat1, lon1, lat2, lon2 = map(
        math.radians,
        [lat1, lon1, lat2, lon2]
    )

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    return radius * 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )


def get_current_weather(latitude: float, longitude: float) -> dict:
    """
    Get weather for any selected location.

    Priority:
    1. Nearest IMD AWS station observation.
    2. Open-Meteo fallback.

    Station observations and model-based data are
    clearly identified in the response.
    """

    if not -90 <= latitude <= 90:
        raise ValueError("Invalid latitude.")

    if not -180 <= longitude <= 180:
        raise ValueError("Invalid longitude.")

    # =========================================
    # STEP 1: FETCH IMD STATION OBSERVATIONS
    # =========================================

    try:
        imd_data = _fetch_json(
            "https://api.imd.gov.in/api/v1/aws_data?sid=2"
        )

        if isinstance(imd_data, dict):
            stations = imd_data.get(
                "data",
                imd_data.get("records", [])
            )
        else:
            stations = imd_data

        if not isinstance(stations, list):
            stations = []

        valid_stations = []

        for station in stations:

            try:
                station_lat = float(
                    station.get("Latitude")
                )

                station_lon = float(
                    station.get("Longitude")
                )

                temperature = float(
                    station.get("CURR_TEMP")
                )

                distance = _haversine_distance(
                    latitude,
                    longitude,
                    station_lat,
                    station_lon
                )

                valid_stations.append({
                    "station": station,
                    "distance": distance,
                    "temperature": temperature
                })

            except (TypeError, ValueError):
                continue

        if valid_stations:

            nearest = min(
                valid_stations,
                key=lambda item: item["distance"]
            )

            # Avoid representing a distant station
            # as the selected location's observation.
            if nearest["distance"] <= 50:

                station = nearest["station"]

                def number(value):
                    try:
                        return float(value)
                    except (TypeError, ValueError):
                        return None

                return {
                    "success": True,
                    "source": "India Meteorological Department",
                    "source_type": "station_observation",

                    "station_name": station.get("STATION"),
                    "station_id": station.get("ID"),

                    "station_latitude": number(
                        station.get("Latitude")
                    ),

                    "station_longitude": number(
                        station.get("Longitude")
                    ),

                    "station_distance_km": round(
                        nearest["distance"], 2
                    ),

                    "latitude": latitude,
                    "longitude": longitude,

                    "updated_at": (
                        str(station.get("DATE", ""))
                        + " "
                        + str(station.get("TIME", ""))
                    ),

                    "temperature": number(
                        station.get("CURR_TEMP")
                    ),

                    "temperature_unit": "°C",
                    # IMD AWS response fields are not assumed unless
                    # the provider actually supplies a matching value.
                    "feels_like_temperature": None,
                    "feels_like_temperature_unit": "°C",

                    "humidity": number(
                        station.get("RH")
                    ),

                    "humidity_unit": "%",

                    "precipitation": None,
                    "precipitation_unit": "mm",

                    "wind_speed": number(
                        station.get("WIND_SPEED")
                    ),

                    "wind_speed_unit": "km/h",
                    "wind_direction": number(station.get("WIND_DIRECTION")),
                    "wind_direction_unit": "°",
                    "wind_gusts": number(station.get("WIND_GUST")),
                    "wind_gusts_unit": "km/h",
                    "pressure": number(station.get("PRESSURE")),
                    "pressure_unit": "hPa",

                    "weather_code": station.get(
                        "WEATHER_CODE"
                    )
                }

    except Exception as error:
        print("IMD weather provider unavailable:", str(error))

    # =========================================
    # STEP 2: OPEN-METEO FALLBACK
    # =========================================

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": (
        "temperature_2m,"
        "relative_humidity_2m,"
        "apparent_temperature,"
        "precipitation,"
        "wind_speed_10m,"
        "wind_direction_10m,"
        "wind_gusts_10m,"
        "surface_pressure,"
        "cloud_cover,"
        "uv_index,"
        "weather_code"
    ),
        "wind_speed_unit": "kmh",
        "timezone": "auto"
    }
    url = (
        "https://api.open-meteo.com/v1/forecast?"
        + urlencode(params)
    )

    try:
        data = _fetch_json(url)

    except Exception as error:
        raise RuntimeError(
            "IMD and Open-Meteo weather providers "
            "are currently unavailable."
        ) from error

    current = data.get("current")

    if not current:
        raise RuntimeError(
            "Current weather information is unavailable."
        )

    units = data.get("current_units", {})

    if current.get("temperature_2m") is None:
        raise RuntimeError(
            "Current temperature is unavailable."
        )

    return {
        "success": True,
        "source": "Open-Meteo",
        "source_type": "model_based_current_weather",

        "station_name": None,
        "station_distance_km": None,

        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),

        "timezone": data.get("timezone"),
        "updated_at": current.get("time"),

        "temperature": current.get("temperature_2m"),
        "temperature_unit": units.get("temperature_2m", "°C"),

        "feels_like": current.get("apparent_temperature"),
        "feels_like_unit": units.get("apparent_temperature", "°C"),

        "humidity": current.get("relative_humidity_2m"),
        "humidity_unit": "%",

        "precipitation": current.get("precipitation"),
        "precipitation_unit": "mm",

        "wind_speed": current.get("wind_speed_10m"),
        "wind_speed_unit": units.get("wind_speed_10m", "km/h"),

        "wind_direction": current.get("wind_direction_10m"),
        "wind_direction_unit": "°",

        "wind_gusts": current.get("wind_gusts_10m"),
        "wind_gusts_unit": units.get("wind_gusts_10m", "km/h"),

        "pressure": current.get("surface_pressure"),
        "pressure_unit": units.get("surface_pressure", "hPa"),

        "cloud_cover": current.get("cloud_cover"),
        "cloud_cover_unit": "%",

        "uv_index": current.get("uv_index"),
        "uv_index_unit": "index",

        "weather_code": current.get("weather_code")
    }
def get_historical_weather(
    latitude: float,
    longitude: float,
    start_date: str,
    end_date: str
) -> dict:
    """
    Fetch daily historical weather data from Open-Meteo.

    Returns:
        Daily mean temperature,
        daily mean humidity,
        daily total precipitation,
        daily maximum wind speed,
        weather code.
    """

    # Validate coordinates
    if not -90 <= latitude <= 90:
        raise ValueError("Latitude must be between -90 and 90.")

    if not -180 <= longitude <= 180:
        raise ValueError("Longitude must be between -180 and 180.")

    # Validate date format
    try:
        start_day = date.fromisoformat(start_date)
        end_day = date.fromisoformat(end_date)

    except (TypeError, ValueError) as error:
        raise ValueError(
            "Dates must use YYYY-MM-DD format."
        ) from error

    # Validate date range
    if start_day > end_day:
        raise ValueError(
            "Start date cannot be after end date."
        )

    # Historical API parameters
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": start_day.isoformat(),
        "end_date": end_day.isoformat(),
        "daily": (
            "temperature_2m_mean,"
            "relative_humidity_2m_mean,"
            "precipitation_sum,"
            "wind_speed_10m_max,"
            "weather_code"
        ),
        "models": "era5",
        "timezone": "auto"
    }
    url = (
        "https://archive-api.open-meteo.com/v1/archive?"
        + urlencode(params)
    )

    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "ElNinoAI/1.0"
        }
    )

    # Request historical weather data
    try:
        with urlopen(request, timeout=30) as response:
            data = json.loads(
                response.read().decode("utf-8")
            )

    except HTTPError as error:
        raise RuntimeError(
            f"Historical weather API returned HTTP {error.code}."
        ) from error

    except URLError as error:
        raise RuntimeError(
            "Unable to connect to the historical weather API. "
            "Check your internet connection."
        ) from error

    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        raise RuntimeError(
            "Historical weather API returned an invalid response."
        ) from error

    # Extract daily data
    daily = data.get("daily")

    if not daily or not daily.get("time"):
        raise RuntimeError(
            "Historical weather data is unavailable for this period."
        )

    units = data.get("daily_units", {})
    dates = daily["time"]

    # Safely read values from the API response
    def get_value(field, index):
        values = daily.get(field) or []

        if index < len(values):
            return values[index]

        return None

    # Convert API arrays into individual daily records
    records = []

    for index, day in enumerate(dates):
        records.append({
            "date": day,

            "temperature_c": get_value(
                "temperature_2m_mean", index
            ),

            "humidity_percent": get_value(
                "relative_humidity_2m_mean", index
            ),

            "precipitation_mm": get_value(
                "precipitation_sum", index
            ),

            "wind_speed_kmh": get_value(
                "wind_speed_10m_max", index
            ),

            "weather_code": get_value(
                "weather_code", index
            )
        })

    # Return historical data
    return {
        "success": True,
        "source": "Open-Meteo Historical Weather API",
        "model": params.get("models", "best_match"),
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "timezone": data.get("timezone"),

        "start_date": start_day.isoformat(),
        "end_date": end_day.isoformat(),

        "units": {
            "temperature": units.get(
                "temperature_2m_mean", "°C"
            ),
            "humidity": units.get(
                "relative_humidity_2m_mean", "%"
            ),
            "precipitation": units.get(
                "precipitation_sum", "mm"
            ),
            "wind_speed": units.get(
                "wind_speed_10m_max", "km/h"
            )
        },

        "total_records": len(records),
        "records": records
    }    
    
def fetch_and_save_historical_weather(
    location_id: int,
    start_date: str,
    end_date: str,
    user_id: int
) -> dict:
    """
    Fetch only missing historical weather dates
    for the authenticated user's selected location.

    Existing records are preserved.
    Duplicate records are prevented.
    """

    if location_id <= 0 or user_id <= 0:
        raise ValueError("Invalid location or user ID.")

    try:
        first_date = date.fromisoformat(start_date)
        last_date = date.fromisoformat(end_date)

    except (TypeError, ValueError) as error:
        raise ValueError(
            "Dates must use YYYY-MM-DD format."
        ) from error

    if first_date > last_date:
        raise ValueError(
            "Start date cannot be after end date."
        )

    # =============================================
    # STEP 1: VERIFY LOCATION AND GET COORDINATES
    # =============================================

    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    location_id,
                    location_name,
                    latitude,
                    longitude
                FROM public.user_locations
                WHERE location_id = %s
                  AND user_id = %s
                """,
                (location_id, user_id)
            )

            location = cursor.fetchone()

            if location is None:
                raise ValueError(
                    "Location not found for this user."
                )

            location_name = location[1]
            latitude = float(location[2])
            longitude = float(location[3])

            # =====================================
            # STEP 2: FIND EXISTING DATES
            # =====================================

            cursor.execute(
                """
                SELECT DISTINCT observation_date
                FROM public.historical_weather_observations
                WHERE location_id = %s
                  AND observation_date BETWEEN %s AND %s
                """,
                (
                    location_id,
                    first_date,
                    last_date
                )
            )

            existing_dates = {
                row[0]
                for row in cursor.fetchall()
            }

    finally:
        connection.close()

    # =============================================
    # STEP 3: IDENTIFY MISSING DATES
    # =============================================

    missing_dates = []

    current_day = first_date

    while current_day <= last_date:

        if current_day not in existing_dates:
            missing_dates.append(current_day)

        current_day += timedelta(days=1)

    if not missing_dates:

        return {
            "success": True,
            "message": "Historical data already available.",
            "location": {
                "location_id": location_id,
                "location_name": location_name,
                "latitude": latitude,
                "longitude": longitude
            },
            "inserted_records": 0,
            "duplicates_skipped": 0,
            "missing_dates": 0
        }

    # =============================================
    # STEP 4: GROUP CONTINUOUS MISSING DATES
    # =============================================

    date_ranges = []

    range_start = missing_dates[0]
    range_end = missing_dates[0]

    for missing_day in missing_dates[1:]:

        if missing_day == range_end + timedelta(days=1):
            range_end = missing_day

        else:
            date_ranges.append(
                (range_start, range_end)
            )

            range_start = missing_day
            range_end = missing_day

    date_ranges.append(
        (range_start, range_end)
    )

    # =============================================
    # STEP 5: FETCH MISSING HISTORICAL DATA
    # =============================================

    fetched_records = []

    for range_start, range_end in date_ranges:

        result = get_historical_weather(
            latitude=latitude,
            longitude=longitude,
            start_date=range_start.isoformat(),
            end_date=range_end.isoformat()
        )

        records = result.get("records", [])

        expected_dates = []

        current_day = range_start

        while current_day <= range_end:
            expected_dates.append(
                current_day.isoformat()
            )

            current_day += timedelta(days=1)

        received_dates = [
            record.get("date")
            for record in records
        ]

        if received_dates != expected_dates:
            raise RuntimeError(
                "Historical API returned incomplete data "
                f"for {range_start} to {range_end}."
            )

        for record in records:

            required_fields = [
                "temperature_c",
                "humidity_percent",
                "precipitation_mm",
                "wind_speed_kmh"
            ]

            for field in required_fields:

                value = record.get(field)

                if (
                    not isinstance(value, (int, float))
                    or isinstance(value, bool)
                ):
                    raise ValueError(
                        f"Invalid {field} for {record['date']}."
                    )

            if not -90 <= record["temperature_c"] <= 60:
                raise ValueError("Temperature out of range.")

            if not 0 <= record["humidity_percent"] <= 100:
                raise ValueError("Humidity out of range.")

            if (
                record["precipitation_mm"] < 0
                or record["wind_speed_kmh"] < 0
            ):
                raise ValueError("Invalid negative weather value.")

            fetched_records.append({
                **record,
                "source": result["source"],
                "model": result["model"]
            })

    # =============================================
    # STEP 6: SAVE RECORDS TO POSTGRESQL
    # =============================================

    connection = get_db_connection()

    inserted_records = 0
    duplicates_skipped = 0

    try:
        with connection.cursor() as cursor:

            for record in fetched_records:

                cursor.execute(
                    """
                    INSERT INTO public.historical_weather_observations (
                        location_id,
                        observation_date,
                        temperature_c,
                        humidity_percent,
                        precipitation_mm,
                        wind_speed_kmh,
                        weather_code,
                        source,
                        model_name
                    )
                    VALUES (
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s
                    )
                    ON CONFLICT (
                        location_id,
                        observation_date,
                        source,
                        model_name
                    )
                    DO NOTHING
                    """,
                    (
                        location_id,
                        record["date"],
                        record["temperature_c"],
                        record["humidity_percent"],
                        record["precipitation_mm"],
                        record["wind_speed_kmh"],
                        record.get("weather_code"),
                        record["source"],
                        record["model"]
                    )
                )

                if cursor.rowcount == 1:
                    inserted_records += 1

                else:
                    duplicates_skipped += 1

        connection.commit()

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()

    # =============================================
    # STEP 7: RETURN RESULT
    # =============================================

    return {
        "success": True,
        "location": {
            "location_id": location_id,
            "location_name": location_name,
            "latitude": latitude,
            "longitude": longitude
        },
        "source": "Open-Meteo Historical Weather API",
        "model": "era5",
        "requested_start_date": start_date,
        "requested_end_date": end_date,
        "missing_dates_found": len(missing_dates),
        "records_received": len(fetched_records),
        "inserted_records": inserted_records,
        "duplicates_skipped": duplicates_skipped
    }
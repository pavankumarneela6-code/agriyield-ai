import requests

# Open-Meteo Historical Weather API
API_URL = "https://archive-api.open-meteo.com/v1/archive"

# Existing Kakinada location coordinates
LATITUDE = 16.989100
LONGITUDE = 82.247500

# Small test period: 1950 January 1 to January 7
START_DATE = "1950-01-01"
END_DATE = "1950-01-07"

# Same historical model used by our project
MODEL = "era5"

HOURLY_VARIABLES = [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "wind_speed_10m",
    "weather_code",
]

params = {
    "latitude": LATITUDE,
    "longitude": LONGITUDE,
    "start_date": START_DATE,
    "end_date": END_DATE,
    "hourly": ",".join(HOURLY_VARIABLES),
    "models": MODEL,
    "timezone": "Asia/Kolkata",
    "wind_speed_unit": "kmh",
    "precipitation_unit": "mm",
}

print("=" * 60)
print("EL NINO AI - HISTORICAL DATA AVAILABILITY TEST")
print("=" * 60)

print(f"Model: {MODEL}")
print(f"Location: {LATITUDE}, {LONGITUDE}")
print(f"Requested period: {START_DATE} to {END_DATE}")
print("Database writes: DISABLED")
print("\nRequesting data from Open-Meteo...")

try:
    response = requests.get(
        API_URL,
        params=params,
        timeout=60,
    )

    response.raise_for_status()
    data = response.json()

    if data.get("error"):
        raise RuntimeError(
            data.get("reason", "API returned an error.")
        )

    hourly = data.get("hourly", {})
    times = hourly.get("time", [])

    if not times:
        raise RuntimeError(
            "API returned no hourly observations."
        )

    print("\nAPI response received successfully.")
    print(f"Returned model: {MODEL}")
    print(f"Returned latitude: {data.get('latitude')}")
    print(f"Returned longitude: {data.get('longitude')}")
    print(f"Total hourly observations: {len(times)}")

    expected_hours = 7 * 24

    print(f"Expected hourly observations: {expected_hours}")

    missing_variables = []
    variables_with_missing_values = []

    print("\nVariable validation:")

    for variable in HOURLY_VARIABLES:
        values = hourly.get(variable)

        if values is None:
            missing_variables.append(variable)
            print(f"{variable}: NOT RETURNED")
            continue

        missing_count = sum(
            value is None for value in values
        )

        print(
            f"{variable}: {len(values)} values, "
            f"{missing_count} missing"
        )

        if len(values) != len(times):
            variables_with_missing_values.append(variable)

        if missing_count > 0:
            variables_with_missing_values.append(variable)

    if (
        len(times) == expected_hours
        and not missing_variables
        and not variables_with_missing_values
    ):
        print("\nSUCCESS: Historical ERA5 availability confirmed.")
        print("The requested data passed basic validation.")
        print("No PostgreSQL records were inserted or modified.")

    else:
        print("\nWARNING: Response needs further validation.")
        print("Do not start bulk historical import yet.")

        if missing_variables:
            print("Missing variables:", missing_variables)

        if variables_with_missing_values:
            print(
                "Variables with incomplete data:",
                sorted(set(variables_with_missing_values)),
            )

        if len(times) != expected_hours:
            print("Returned hourly count differs from expectation.")

except requests.exceptions.Timeout:
    print("\nERROR: API request timed out.")
    print("Check your internet connection and try again.")

except requests.exceptions.RequestException as error:
    print("\nERROR: Could not retrieve historical weather data.")
    print(error)

except (ValueError, RuntimeError) as error:
    print("\nERROR: Historical data validation failed.")
    print(error)
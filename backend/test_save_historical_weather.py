from datetime import date

from database import get_db_connection
from services.weather_service import (
    fetch_and_save_historical_weather
)


# =============================================
# IMPORT SETTINGS
# =============================================

LOCATION_ID = 13
USER_ID = 1

START_DATE = "2020-01-01"
END_DATE = "2025-12-31"

MODEL_NAME = "era5"
SOURCE = "Open-Meteo Historical Weather API"


def main():

    start = date.fromisoformat(START_DATE)
    end = date.fromisoformat(END_DATE)

    expected_records = (end - start).days + 1

    print("\nHistorical Weather Import")
    print("=========================")

    print("Location ID:", LOCATION_ID)
    print("User ID:", USER_ID)
    print("Model:", MODEL_NAME.upper())
    print("Period:", START_DATE, "to", END_DATE)
    print("Expected daily records:", expected_records)

    # =========================================
    # FETCH AND SAVE HISTORICAL WEATHER
    # =========================================

    result = fetch_and_save_historical_weather(
        location_id=LOCATION_ID,
        user_id=USER_ID,
        start_date=START_DATE,
        end_date=END_DATE
    )

    print("\nImport Result")
    print("-------------")

    print("Success:", result["success"])
    print("Source:", result.get("source", SOURCE))
    print("Model:", result.get("model", MODEL_NAME).upper())

    print("Records received:", result.get("records_received", 0))
    print("Records inserted:", result["inserted_records"])
    print("Duplicates skipped:", result["duplicates_skipped"])

    # =========================================
    # VERIFY POSTGRESQL DATA
    # =========================================

    connection = get_db_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    COUNT(*),
                    MIN(observation_date),
                    MAX(observation_date),
                    COUNT(temperature_c),
                    COUNT(humidity_percent),
                    COUNT(precipitation_mm),
                    COUNT(wind_speed_kmh)
                FROM public.historical_weather_observations
                WHERE location_id = %s
                  AND observation_date BETWEEN %s AND %s
                  AND source = %s
                  AND model_name = %s
                """,
                (
                    LOCATION_ID,
                    START_DATE,
                    END_DATE,
                    SOURCE,
                    MODEL_NAME
                )
            )

            row = cursor.fetchone()

    finally:
        connection.close()

    # =========================================
    # DISPLAY VERIFICATION
    # =========================================

    print("\nPostgreSQL Verification")
    print("=======================")

    print("Stored records:", row[0])
    print("First date:", row[1])
    print("Last date:", row[2])
    print("Temperature values:", row[3])
    print("Humidity values:", row[4])
    print("Precipitation values:", row[5])
    print("Wind speed values:", row[6])

    # =========================================
    # FINAL VALIDATION
    # =========================================

    if (
        row[0] == expected_records
        and str(row[1]) == START_DATE
        and str(row[2]) == END_DATE
        and all(value == expected_records for value in row[3:])
    ):

        print(
            "\nSUCCESS: Historical weather records "
            "verified successfully."
        )

    else:

        print(
            "\nCHECK REQUIRED: Stored historical records "
            "do not match the expected daily records."
        )


if __name__ == "__main__":
    main()
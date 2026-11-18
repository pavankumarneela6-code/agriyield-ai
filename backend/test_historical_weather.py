import json
from datetime import date, timedelta

from services.weather_service import get_historical_weather


def main():
    # Kakinada coordinates
    latitude = 16.989100
    longitude = 82.247500

    # Historical period for testing
    START_DATE = "1950-01-01"
    END_DATE = "1950-01-07"
   

    print("Fetching real historical weather data...")

    try:
        start_day = date.fromisoformat(START_DATE)
        end_day = date.fromisoformat(END_DATE)

        if start_day > end_day:
            raise ValueError(
                "Start date cannot be after end date."
            )

        result = get_historical_weather(
            latitude=latitude,
            longitude=longitude,
            start_date=START_DATE,
            end_date=END_DATE
        )

        print("\nData source:", result["source"])
        print(
            "Model requested:",
            result.get("model", "not returned")
        )
        print(
            "Location:",
            result["latitude"],
            result["longitude"]
        )
        print(
            "Period:",
            result["start_date"],
            "to",
            result["end_date"]
        )
        print("Total records:", result["total_records"])

        records = result["records"]

        print("\nFirst 3 daily records:")
        print(json.dumps(records[:3], indent=2))

        # Generate expected dates from the selected range
        expected_count = (end_day - start_day).days + 1

        expected_dates = [
            (start_day + timedelta(days=i)).isoformat()
            for i in range(expected_count)
        ]

        required_fields = [
            "temperature_c",
            "humidity_percent",
            "precipitation_mm",
            "wind_speed_kmh"
        ]

        problems = []

        # 1. Check record count
        if len(records) != expected_count:
            problems.append(
                f"Expected {expected_count} records, "
                f"received {len(records)}."
            )

        # 2. Check dates
        actual_dates = [
            record.get("date")
            for record in records
        ]

        if actual_dates != expected_dates:
            problems.append(
                "Dates are missing, duplicated, or out of order."
            )

        # 3. Validate weather values
        for record in records:
            day = record.get("date", "Unknown date")

            for field in required_fields:
                value = record.get(field)

                if (
                    not isinstance(value, (int, float))
                    or isinstance(value, bool)
                ):
                    problems.append(
                        f"{day}: {field} is missing or invalid."
                    )
                    continue

                if field == "temperature_c":
                    if not -90 <= value <= 60:
                        problems.append(
                            f"{day}: temperature out of range."
                        )

                elif field == "humidity_percent":
                    if not 0 <= value <= 100:
                        problems.append(
                            f"{day}: humidity out of range."
                        )

                elif field in (
                    "precipitation_mm",
                    "wind_speed_kmh"
                ):
                    if value < 0:
                        problems.append(
                            f"{day}: {field} cannot be negative."
                        )

        # 4. Show validation result
        if problems:
            print("\nVALIDATION FAILED:")

            for problem in problems:
                print("-", problem)

            print("\nDo not save these records yet.")

        else:
            print("\nVALIDATION PASSED")
            print("Records verified:", len(records))
            print(
                "Date range:",
                actual_dates[0],
                "to",
                actual_dates[-1]
            )
            print("Source:", result["source"])
            print("Model:", result.get("model", "not returned"))
            print("PostgreSQL was not modified.")

    except (ValueError, RuntimeError) as error:
        print("\nHistorical data test failed:", error)


if __name__ == "__main__":
    main()
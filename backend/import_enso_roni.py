from datetime import date
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from database import get_db_connection


# Official NOAA CPC RONI data file
NOAA_URL = (
    "https://www.cpc.ncep.noaa.gov/"
    "data/indices/RONI.ascii.txt"
)

START_YEAR = 1950
END_YEAR = 2019

SOURCE = "NOAA Climate Prediction Center"
INDEX_NAME = "RONI"
DATASET_VERSION = "ERSSTv6"

SEASONS = [
    "DJF", "JFM", "FMA", "MAM",
    "AMJ", "MJJ", "JJA", "JAS",
    "ASO", "SON", "OND", "NDJ"
]

# The center month of each three-month running season.
SEASON_CENTER_MONTH = {
    "DJF": 1,
    "JFM": 2,
    "FMA": 3,
    "MAM": 4,
    "AMJ": 5,
    "MJJ": 6,
    "JJA": 7,
    "JAS": 8,
    "ASO": 9,
    "SON": 10,
    "OND": 11,
    "NDJ": 12,
}


def fetch_noaa_roni():
    """Fetch original RONI values from the official NOAA CPC file."""

    request = Request(
        NOAA_URL,
        headers={
            "Accept": "text/plain",
            "User-Agent": "ElNinoAI/1.0"
        }
    )

    try:
        with urlopen(request, timeout=30) as response:
            final_url = response.geturl()

            if urlparse(final_url).hostname != "www.cpc.ncep.noaa.gov":
                raise RuntimeError(
                    "The request was redirected away from the NOAA CPC host."
                )

            text = response.read().decode("utf-8")

    except HTTPError as error:
        raise RuntimeError(
            f"NOAA returned HTTP {error.code}."
        ) from error

    except URLError as error:
        raise RuntimeError(
            "Unable to connect to NOAA. Check your internet connection."
        ) from error

    except UnicodeDecodeError as error:
        raise RuntimeError(
            "The NOAA response could not be decoded."
        ) from error

    records = []

    # NOAA file columns: SEAS YR ANOM
    for line in text.splitlines():
        columns = line.split()

        if len(columns) < 3:
            continue

        season = columns[0]

        if season not in SEASONS:
            continue

        try:
            year = int(columns[1])
            value = float(columns[2])

        except ValueError:
            continue

        if START_YEAR <= year <= END_YEAR:
            records.append({
                "season_label": season,
                "season_year": year,
                "index_value_c": value,
            })

    return records


def validate_records(records):
    """Validate the requested period before writing to PostgreSQL."""

    expected = [
        (year, season)
        for year in range(START_YEAR, END_YEAR + 1)
        for season in SEASONS
    ]

    actual = [
        (record["season_year"], record["season_label"])
        for record in records
    ]

    if actual != expected:
        raise ValueError(
            f"Expected {len(expected)} ordered seasonal records; "
            f"received {len(records)}. No data was saved."
        )

    for record in records:
        value = record["index_value_c"]

        if not -5 <= value <= 5:
            raise ValueError(
                f"Unexpected RONI value for "
                f"{record['season_label']} {record['season_year']}."
            )

    return len(expected)


def save_records(records):
    """Insert validated RONI records without creating duplicates."""

    connection = None
    inserted = 0
    skipped = 0

    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            for record in records:
                year = record["season_year"]
                season = record["season_label"]

                # Store the season's center month as the first day
                # of that month, to identify each overlapping season.
                center_month = date(
                    year,
                    SEASON_CENTER_MONTH[season],
                    1
                )

                cursor.execute(
                    """
                    INSERT INTO public.enso_index_observations (
                        index_name,
                        season_year,
                        season_label,
                        center_month,
                        index_value_c,
                        dataset_version,
                        source,
                        source_url
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)

                    ON CONFLICT (
                        index_name,
                        center_month,
                        dataset_version
                    )
                    DO NOTHING
                    RETURNING enso_observation_id
                    """,
                    (
                        INDEX_NAME,
                        year,
                        season,
                        center_month,
                        record["index_value_c"],
                        DATASET_VERSION,
                        SOURCE,
                        NOAA_URL,
                    )
                )

                if cursor.fetchone() is not None:
                    inserted += 1
                else:
                    skipped += 1

        connection.commit()

    except Exception:
        if connection is not None:
            connection.rollback()
        raise

    finally:
        if connection is not None:
            connection.close()

    return inserted, skipped


def verify_records():
    """Read back the stored records for independent count verification."""

    connection = None

    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    COUNT(*),
                    MIN(center_month),
                    MAX(center_month),
                    COUNT(DISTINCT center_month),
                    COUNT(index_value_c)
                FROM public.enso_index_observations
                WHERE index_name = %s
                  AND dataset_version = %s
                  AND center_month >= %s
                  AND center_month < %s
                """,
                (
                    INDEX_NAME,
                    DATASET_VERSION,
                    date(START_YEAR, 1, 1),
                    date(END_YEAR + 1, 1, 1),
                )
            )

            return cursor.fetchone()

    finally:
        if connection is not None:
            connection.close()


def main():
    print("El Niño AI — NOAA RONI Import")
    print("-----------------------------")
    print("Source:", SOURCE)
    print("Dataset:", DATASET_VERSION)
    print("Period:", START_YEAR, "to", END_YEAR)

    records = fetch_noaa_roni()
    expected_count = validate_records(records)

    print("Records fetched and validated:", len(records))

    inserted, skipped = save_records(records)

    print("\nImport result:")
    print("Records inserted:", inserted)
    print("Duplicates skipped:", skipped)

    result = verify_records()

    print("\nPostgreSQL verification:")
    print("Stored records:", result[0])
    print("First center month:", result[1])
    print("Last center month:", result[2])
    print("Unique center months:", result[3])
    print("Non-null index values:", result[4])

    if result[0] == expected_count and result[3] == expected_count:
        print("\nSUCCESS: All 72 seasonal RONI records verified.")
    else:
        print(
            "\nCHECK REQUIRED: The stored record count does not "
            "match the expected 72 records."
        )


if __name__ == "__main__":
    main()
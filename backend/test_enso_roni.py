from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError


# Official NOAA CPC RONI data source
NOAA_URL = (
    "https://www.cpc.ncep.noaa.gov/"
    "data/indices/RONI.ascii.txt"
)

START_YEAR = 2020
END_YEAR = 2025

SEASONS = [
    "DJF", "JFM", "FMA", "MAM",
    "AMJ", "MJJ", "JJA", "JAS",
    "ASO", "SON", "OND", "NDJ"
]


def fetch_noaa_roni():
    """Download official RONI values from NOAA CPC."""

    request = Request(
        NOAA_URL,
        headers={
            "Accept": "text/plain",
            "User-Agent": "ElNinoAI/1.0"
        }
    )

    try:
        with urlopen(request, timeout=30) as response:
            text = response.read().decode("utf-8")

    except HTTPError as error:
        raise RuntimeError(
            f"NOAA returned HTTP {error.code}."
        ) from error

    except URLError as error:
        raise RuntimeError(
            "Could not connect to NOAA. Check internet connection."
        ) from error

    except UnicodeDecodeError as error:
        raise RuntimeError(
            "Could not decode the NOAA response."
        ) from error

    records = []

    # Official NOAA file format:
    # SEAS  YR  ANOM
    for line in text.splitlines():
        columns = line.split()

        if len(columns) < 3:
            continue

        season = columns[0]

        if season not in SEASONS:
            continue

        try:
            year = int(columns[1])
            index_value = float(columns[2])

        except ValueError:
            continue

        if START_YEAR <= year <= END_YEAR:
            records.append({
                "season_label": season,
                "season_year": year,
                "index_value_c": index_value
            })

    return records


def validate_roni(records):
    """Validate completeness and ordering of the downloaded data."""

    expected_count = (END_YEAR - START_YEAR + 1) * 12

    if len(records) != expected_count:
        raise ValueError(
            f"Expected {expected_count} records, "
            f"received {len(records)}."
        )

    record_keys = [
        (record["season_year"], record["season_label"])
        for record in records
    ]

    if len(record_keys) != len(set(record_keys)):
        raise ValueError("Duplicate season records found.")

    for year in range(START_YEAR, END_YEAR + 1):
        year_records = [
            record
            for record in records
            if record["season_year"] == year
        ]

        actual_seasons = [
            record["season_label"]
            for record in year_records
        ]

        if actual_seasons != SEASONS:
            raise ValueError(
                f"Missing or incorrectly ordered seasons for {year}."
            )

    for record in records:
        value = record["index_value_c"]

        if not -5 <= value <= 5:
            raise ValueError(
                f"Unexpected RONI value: {value}"
            )


def main():
    print("El Niño AI — Official NOAA RONI Test")
    print("------------------------------------")

    try:
        records = fetch_noaa_roni()
        validate_roni(records)

        print("Source: NOAA Climate Prediction Center")
        print("Index: Relative Oceanic Niño Index (RONI)")
        print("Dataset: ERSSTv6")
        print("Period:", START_YEAR, "to", END_YEAR)
        print("Records received:", len(records))

        print("\nRecords by year:")

        for year in range(START_YEAR, END_YEAR + 1):
            count = sum(
                record["season_year"] == year
                for record in records
            )

            print(f"{year}: {count} seasonal records")

        print("\nFirst 3 records:")
        for record in records[:3]:
            print(record)

        print("\nLast 3 records:")
        for record in records[-3:]:
            print(record)

        print("\nVALIDATION PASSED")
        print("All 72 seasonal records verified.")
        print("PostgreSQL was not modified.")

    except (RuntimeError, ValueError) as error:
        print("\nNOAA RONI test failed:", error)


if __name__ == "__main__":
    main()
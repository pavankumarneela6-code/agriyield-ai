import urllib.request
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException


router = APIRouter(
    prefix="/api/enso",
    tags=["ENSO Monitoring"]
)

NOAA_RONI_URL = (
    "https://www.cpc.ncep.noaa.gov/data/indices/RONI.ascii.txt"
)


def fetch_noaa_roni_data():

    request = urllib.request.Request(
        NOAA_RONI_URL,
        headers={
            "User-Agent": "ElNinoAI/1.0",
            "Accept": "text/plain"
        }
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=25
        ) as response:

            content = response.read().decode("utf-8")

    except Exception as error:

        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve NOAA RONI data: {str(error)}"
        )

    records = []

    for line in content.splitlines():

        parts = line.split()

        if len(parts) != 3:
            continue

        season, year, value = parts

        try:
            records.append({
                "season": season,
                "year": int(year),
                "roni": float(value)
            })

        except ValueError:
            continue

    if not records:

        raise HTTPException(
            status_code=502,
            detail="NOAA RONI dataset contains no valid records."
        )

    return records


def classify_enso(value):

    if value >= 0.5:
        return "El Niño"

    if value <= -0.5:
        return "La Niña"

    return "ENSO Neutral"


def classify_official_episode(records):

    latest_five = records[-5:]

    if len(latest_five) < 5:
        return "Insufficient observations"

    values = [
        record["roni"]
        for record in latest_five
    ]

    if all(value >= 0.5 for value in values):
        return "El Niño episode criteria met"

    if all(value <= -0.5 for value in values):
        return "La Niña episode criteria met"

    return "No sustained episode confirmed"


@router.get("/current")
def get_current_enso():

    records = fetch_noaa_roni_data()

    latest = records[-1]

    roni_value = latest["roni"]

    return {
        "success": True,

        "index_name": "Relative Oceanic Niño Index",

        "index_abbreviation": "RONI",

        "enso_condition": classify_enso(roni_value),

        "roni_value": roni_value,

        "unit": "°C",

        "observation_period": (
            f'{latest["season"]} {latest["year"]}'
        ),

        "episode_status": classify_official_episode(
            records
        ),

        "thresholds": {
            "el_nino": "RONI >= +0.5°C",
            "la_nina": "RONI <= -0.5°C",
            "neutral": "Between -0.5°C and +0.5°C"
        },

        "source": "NOAA Climate Prediction Center",

        "source_url": NOAA_RONI_URL,

        "retrieved_at": datetime.now(
            timezone.utc
        ).isoformat(),

        "data_type": "Official NOAA climate index observation"
    }
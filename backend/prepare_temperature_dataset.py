from pathlib import Path

import numpy as np
import pandas as pd


# ==================================================
# 1. FILE PATHS
# ==================================================

BASE_DIR = Path(__file__).resolve().parent

INPUT_FILE = (
    BASE_DIR
    / "seasonal_validation_1950_2019_baseline_1981_2010.csv"
)

OUTPUT_FILE = (
    BASE_DIR
    / "temperature_prediction_dataset_1981_2010_baseline.csv"
)

# ==================================================
# 2. LOAD HISTORICAL DATA
# ==================================================

if not INPUT_FILE.exists():
    raise FileNotFoundError(
        f"CSV file not found: {INPUT_FILE}"
    )

df = pd.read_csv(INPUT_FILE)

print("=" * 65)
print("EL NINO AI - TEMPERATURE PREDICTION DATA PREPARATION")
print("=" * 65)

print(f"Original rows: {len(df)}")


# ==================================================
# 3. VALIDATE REQUIRED COLUMNS
# ==================================================

required_columns = [
    "center_month",
    "season_year",
    "season_label",
    "roni_value",
    "temperature_anomaly_3month_c",
    "precipitation_anomaly_3month_mm",
    "humidity_anomaly_pp",
    "wind_anomaly_kmh",
]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"CSV lo columns missing: {missing_columns}"
    )


# ==================================================
# 4. CLEAN AND SORT CHRONOLOGICALLY
# ==================================================

df["center_month"] = pd.to_datetime(
    df["center_month"],
    errors="coerce"
)

numeric_columns = [
    "season_year",
    "roni_value",
    "temperature_anomaly_3month_c",
    "precipitation_anomaly_3month_mm",
    "humidity_anomaly_pp",
    "wind_anomaly_kmh",
]

for column in numeric_columns:
    df[column] = pd.to_numeric(
        df[column],
        errors="coerce"
    )

df = df.dropna(
    subset=required_columns
).copy()

df = df.sort_values(
    "center_month"
).reset_index(drop=True)

if df["center_month"].duplicated().any():
    raise ValueError(
        "Duplicate seasonal dates found. "
        "Check the CSV before continuing."
    )

if len(df) < 20:
    raise ValueError(
        "Insufficient complete seasonal observations."
    )

# Selected seasons should be exactly three months apart.
month_number = (
    df["center_month"].dt.year * 12
    + df["center_month"].dt.month
)

month_gaps = month_number.diff().dropna()

if not month_gaps.eq(3).all():
    raise ValueError(
        "Missing or irregular seasonal intervals detected. "
        "Check the CSV before creating next-season targets."
    )

print(f"Complete original rows: {len(df)}")


# ==================================================
# 5. CREATE PREVIOUS-SEASON FEATURES
# ==================================================

df["roni_previous_season"] = (
    df["roni_value"].shift(1)
)

df["temperature_anomaly_previous_season_c"] = (
    df["temperature_anomaly_3month_c"].shift(1)
)


# ==================================================
# 6. CREATE NEXT-SEASON TARGET
# ==================================================

# Current season information will be used to predict
# the temperature anomaly of the next selected season.

df["target_temperature_anomaly_c"] = (
    df["temperature_anomaly_3month_c"].shift(-1)
)

df["target_center_month"] = (
    df["center_month"].shift(-1)
)

df["target_season_year"] = (
    df["season_year"].shift(-1)
)


# ==================================================
# 7. ADD SEASONAL FEATURES
# ==================================================

month = df["center_month"].dt.month

df["season_sin"] = np.sin(
    2 * np.pi * month / 12
)

df["season_cos"] = np.cos(
    2 * np.pi * month / 12
)


# ==================================================
# 8. SELECT MODEL FEATURES
# ==================================================

feature_columns = [
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

target_column = "target_temperature_anomaly_c"

df = df.dropna(
    subset=feature_columns + [
        target_column,
        "target_center_month",
        "target_season_year",
    ]
).copy()

df["target_season_year"] = (
    df["target_season_year"].astype(int)
)


# ==================================================
# 9. CHRONOLOGICAL TRAIN / VALIDATION / TEST SPLIT
# ==================================================

# Split by the year of the target being predicted,
# not the year of the input features.

conditions = [
    df["target_season_year"] <= 1999,
    df["target_season_year"].between(2000, 2010),
    df["target_season_year"].between(2011, 2019),
]

choices = [
    "train",
    "validation",
    "test",
]

df["split"] = np.select(
    conditions,
    choices,
    default="exclude"
)

df = df[
    df["split"] != "exclude"
].copy()


# ==================================================
# 10. SAVE PREDICTION DATASET
# ==================================================

output_columns = [
    "center_month",
    "season_year",
    "season_label",
    *feature_columns,
    "target_center_month",
    "target_season_year",
    target_column,
    "split",
]

df[output_columns].to_csv(
    OUTPUT_FILE,
    index=False
)


# ==================================================
# 11. DISPLAY RESULTS
# ==================================================

print("\nDataset preparation successful!")

print(f"Output file: {OUTPUT_FILE}")

print(f"Usable observations: {len(df)}")

print("\nChronological split:")

split_counts = (
    df["split"]
    .value_counts()
    .reindex(
        ["train", "validation", "test"],
        fill_value=0
    )
)

for split_name, count in split_counts.items():
    print(f"{split_name.title()}: {count} rows")

print("\nPrediction target:")
print("Next selected season's temperature anomaly (°C)")

print("\nDataset preparation completed.")
from pathlib import Path

import numpy as np
import pandas as pd
import joblib

from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ==================================================
# 1. FILE PATH
# ==================================================

BASE_DIR = Path(__file__).resolve().parent

INPUT_FILE = (
    BASE_DIR
    / "temperature_prediction_dataset_1981_2010_baseline.csv"
)

OUTPUT_FILE = BASE_DIR / "ridge_temperature_predictions.csv"
MODEL_FILE = BASE_DIR / "ridge_temperature_model.joblib"

# ==================================================
# 2. LOAD DATASET
# ==================================================

if not INPUT_FILE.exists():
    raise FileNotFoundError(
        f"Prediction dataset not found: {INPUT_FILE}"
    )

df = pd.read_csv(INPUT_FILE)

print("=" * 70)
print("EL NINO AI - RIDGE REGRESSION")
print("=" * 70)

print(f"Dataset rows: {len(df)}")


# ==================================================
# 3. DEFINE FEATURES AND TARGET
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

required_columns = [
    *feature_columns,
    target_column,
    "split",
    "target_center_month",
    "target_season_year",
]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Required columns missing: {missing_columns}"
    )

for column in feature_columns + [
    target_column,
    "target_season_year",
]:
    df[column] = pd.to_numeric(
        df[column], errors="coerce"
    )

if df[required_columns].isna().any().any():
    raise ValueError(
        "Missing values found. Clean the dataset before training."
    )


# ==================================================
# 4. SPLIT DATA CHRONOLOGICALLY
# ==================================================

train_df = df[df["split"] == "train"].copy()
val_df = df[df["split"] == "validation"].copy()
test_df = df[df["split"] == "test"].copy()

if min(len(train_df), len(val_df), len(test_df)) == 0:
    raise ValueError(
        "Train, validation, or test dataset is empty."
    )

for name, part in [
    ("Train", train_df),
    ("Validation", val_df),
    ("Test", test_df),
]:
    print(
        f"{name}: {len(part)} rows, "
        f"target years {int(part['target_season_year'].min())}"
        f"-{int(part['target_season_year'].max())}"
    )

# Check that target periods are chronologically separated.
if not (
    train_df["target_season_year"].max()
    < val_df["target_season_year"].min()
    and
    val_df["target_season_year"].max()
    < test_df["target_season_year"].min()
):
    raise ValueError(
        "Chronological split check failed."
    )

X_train = train_df[feature_columns]
y_train = train_df[target_column]

X_val = val_df[feature_columns]
y_val = val_df[target_column]

X_test = test_df[feature_columns]
y_test = test_df[target_column]


# ==================================================
# 5. SELECT RIDGE ALPHA USING VALIDATION DATA
# ==================================================

alpha_values = [0.01, 0.1, 1.0, 10.0, 100.0]

validation_results = []

print("\nVALIDATION RESULTS")
print("-" * 70)

for alpha in alpha_values:

    model = Pipeline([
        ("scaler", StandardScaler()),
        ("ridge", Ridge(alpha=alpha)),
    ])

    # Fit only on training data.
    model.fit(X_train, y_train)

    val_predictions = model.predict(X_val)

    val_mae = mean_absolute_error(
        y_val, val_predictions
    )

    val_rmse = np.sqrt(
        mean_squared_error(y_val, val_predictions)
    )

    validation_results.append({
        "alpha": alpha,
        "validation_mae": val_mae,
        "validation_rmse": val_rmse,
    })

    print(
        f"Alpha: {alpha:>6} | "
        f"MAE: {val_mae:.4f} | "
        f"RMSE: {val_rmse:.4f}"
    )

# Choose alpha by validation MAE only.
best_result = min(
    validation_results,
    key=lambda result: result["validation_mae"]
)

best_alpha = best_result["alpha"]

print(f"\nSelected alpha: {best_alpha}")


# ==================================================
# 6. FINAL TRAINING
# ==================================================

# After choosing alpha, combine training and validation data.
# Keep the test data completely untouched until final evaluation.

train_val_df = pd.concat(
    [train_df, val_df],
    ignore_index=True
)

X_train_val = train_val_df[feature_columns]
y_train_val = train_val_df[target_column]

final_model = Pipeline([
    ("scaler", StandardScaler()),
    ("ridge", Ridge(alpha=best_alpha)),
])
final_model.fit(X_train_val, y_train_val)

# Save the trained model and its metadata
joblib.dump(
    {
        "model": final_model,
        "feature_columns": feature_columns,
        "selected_alpha": best_alpha,
        "target": "next_season_temperature_anomaly_c",
        "baseline_period": "1981-2010",
    },
    MODEL_FILE
)

print(f"\nTrained model saved to: {MODEL_FILE}")

test_predictions = final_model.predict(X_test)


# ==================================================
# 7. EVALUATE AGAINST SIMPLE BASELINES
# ==================================================

def calculate_metrics(actual, predicted):
    return {
        "MAE": mean_absolute_error(actual, predicted),
        "RMSE": np.sqrt(
            mean_squared_error(actual, predicted)
        ),
        "R2": r2_score(actual, predicted),
    }


# Baseline 1: predict zero anomaly (climatological anomaly baseline).
zero_predictions = np.zeros(len(y_test))

# Baseline 2: predict the mean target anomaly from training + validation.
mean_value = y_train_val.mean()

mean_predictions = np.full(
    len(y_test), mean_value
)

model_metrics = calculate_metrics(
    y_test, test_predictions
)

zero_metrics = calculate_metrics(
    y_test, zero_predictions
)

mean_metrics = calculate_metrics(
    y_test, mean_predictions
)

print("\nFINAL TEST RESULTS")
print("-" * 70)

for name, metrics in [
    ("Ridge Regression", model_metrics),
    ("Zero-anomaly baseline", zero_metrics),
    ("Training-mean baseline", mean_metrics),
]:

    print(f"\n{name}")
    print(f"MAE:  {metrics['MAE']:.4f} °C")
    print(f"RMSE: {metrics['RMSE']:.4f} °C")
    print(f"R²:   {metrics['R2']:.4f}")


# ==================================================
# 8. SAVE TEST PREDICTIONS
# ==================================================

predictions_df = test_df[
    [
        "target_center_month",
        "target_season_year",
        "target_temperature_anomaly_c",
    ]
].copy()

predictions_df["predicted_temperature_anomaly_c"] = (
    test_predictions
)

predictions_df["prediction_error_c"] = (
    predictions_df["target_temperature_anomaly_c"]
    - predictions_df["predicted_temperature_anomaly_c"]
)

predictions_df.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\nTest predictions saved to:")
print(OUTPUT_FILE)

print("\nTraining and evaluation completed.")
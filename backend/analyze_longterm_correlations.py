import math
import pandas as pd
from scipy.stats import pearsonr, spearmanr


# ============================================
# 1. LOAD HISTORICAL SEASONAL DATA
# ============================================

CSV_FILE = "seasonal_validation_1950_2019.csv"

df = pd.read_csv(CSV_FILE)

metrics = {
    "Temperature": "temperature_anomaly_3month_c",
    "Precipitation": "precipitation_anomaly_3month_mm",
    "Humidity": "humidity_anomaly_pp",
    "Wind": "wind_anomaly_kmh",
}

required_columns = [
    "center_month",
    "roni_value",
    *metrics.values()
]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"CSV lo required columns missing: {missing_columns}"
    )


# ============================================
# 2. VALIDATE DATA
# ============================================

df["center_month"] = pd.to_datetime(
    df["center_month"], errors="coerce"
)

for column in ["roni_value", *metrics.values()]:
    df[column] = pd.to_numeric(
        df[column], errors="coerce"
    )

original_rows = len(df)

data = df[
    ["center_month", "roni_value", *metrics.values()]
].dropna().sort_values("center_month")

if len(data) < 10:
    raise ValueError(
        f"Insufficient complete seasonal records: {len(data)}"
    )

if data["center_month"].duplicated().any():
    raise ValueError(
        "Duplicate seasonal center_month values found. "
        "Check the CSV export before proceeding."
    )

n = len(data)

print("=" * 75)
print("EL NINO AI - LONG-TERM CORRELATION ANALYSIS")
print("=" * 75)

print(f"CSV rows loaded: {original_rows}")
print(f"Complete seasonal observations: {n}")
print("Historical period: 1950-2019")
print("Climate baseline: 1991-2020")
print("Methods: Pearson and Spearman")
print("Significance level: 0.05")
print("Multiple-testing correction: Bonferroni, 4 tests per method")


# ============================================
# 3. PEARSON CONFIDENCE INTERVAL
# ============================================

def pearson_confidence_interval(r, sample_size):
    """
    Approximate 95% confidence interval using Fisher's
    z transformation. Assumes independent observations.
    """

    if abs(r) >= 1:
        return r, r

    fisher_z = math.atanh(r)
    standard_error = 1 / math.sqrt(sample_size - 3)
    z_critical = 1.959964

    lower = math.tanh(
        fisher_z - z_critical * standard_error
    )

    upper = math.tanh(
        fisher_z + z_critical * standard_error
    )

    return lower, upper


# ============================================
# 4. PEARSON AND SPEARMAN ANALYSIS
# ============================================

for method_name, correlation_function in [
    ("PEARSON", pearsonr),
    ("SPEARMAN", spearmanr)
]:

    print(f"\n{'-' * 75}")
    print(f"{method_name} CORRELATION")
    print(f"{'-' * 75}")

    results = []

    for parameter, column in metrics.items():

        x = data["roni_value"]
        y = data[column]

        result = correlation_function(x, y)

        correlation = float(result.statistic)
        p_value = float(result.pvalue)

        results.append({
            "parameter": parameter,
            "correlation": correlation,
            "p_value": p_value
        })

    # Correct for the four weather-parameter comparisons.
    for item in results:

        adjusted_p = min(
            item["p_value"] * len(results), 1.0
        )

        print(f"\nParameter: {item['parameter']}")
        print(
            f"{method_name.title()} correlation: "
            f"{item['correlation']:.4f}"
        )
        print(f"P-value: {item['p_value']:.6f}")
        print(f"Adjusted p-value: {adjusted_p:.6f}")

        if method_name == "PEARSON":
            ci_low, ci_high = pearson_confidence_interval(
                item["correlation"], n
            )

            print(
                "Approx. 95% confidence interval: "
                f"[{ci_low:.4f}, {ci_high:.4f}]"
            )

        if adjusted_p < 0.05:
            print("Result: Significant under this test.")
        else:
            print("Result: Not significant after correction.")

print("\nAnalysis completed successfully.")
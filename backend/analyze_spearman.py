import pandas as pd
import numpy as np
from scipy.stats import spearmanr


# Load actual seasonal observations exported from PostgreSQL
df = pd.read_csv("seasonal_validation.csv")

# Map each weather parameter to its anomaly column
metrics = {
    "Temperature": "temperature_anomaly_3month_c",
    "Precipitation": "precipitation_anomaly_3month_mm",
    "Humidity": "humidity_anomaly_pp",
    "Wind": "wind_anomaly_kmh",
}

required_columns = ["roni_value", *metrics.values()]

# Validate CSV columns before running the analysis
missing = [
    column for column in required_columns
    if column not in df.columns
]

if missing:
    raise ValueError(
        f"Missing CSV columns: {missing}. "
        "Export the detailed seasonal query again."
    )

# Convert required values to numeric and remove incomplete rows
data = df[required_columns].apply(
    pd.to_numeric, errors="coerce"
).dropna()

n = len(data)

if n < 10:
    raise ValueError(
        f"Only {n} complete observations found. "
        "Check the CSV export."
    )

print("=" * 70)
print("EL NINO AI - SPEARMAN CORRELATION ANALYSIS")
print("=" * 70)
print(f"Complete seasonal observations: {n}")
print("Correlation method: Spearman rank correlation")
print("Significance test: Two-sided")

# Reproducible bootstrap sampling for exploratory confidence intervals
rng = np.random.default_rng(42)
bootstrap_samples = 5000
results = []

for parameter, column in metrics.items():

    x = data["roni_value"].to_numpy()
    y = data[column].to_numpy()

    # Spearman correlation and its approximate p-value
    result = spearmanr(x, y)

    rho = float(result.statistic)
    p_value = float(result.pvalue)

    # Bootstrap confidence interval for Spearman's rho
    bootstrap_rhos = []

    for _ in range(bootstrap_samples):
        indices = rng.integers(0, n, size=n)

        xb = x[indices]
        yb = y[indices]

        # Skip samples containing a constant variable
        if np.ptp(xb) == 0 or np.ptp(yb) == 0:
            continue

        boot_result = spearmanr(xb, yb)

        if np.isfinite(boot_result.statistic):
            bootstrap_rhos.append(
                float(boot_result.statistic)
            )

    if len(bootstrap_rhos) < 1000:
        ci_low = np.nan
        ci_high = np.nan
    else:
        ci_low, ci_high = np.percentile(
            bootstrap_rhos, [2.5, 97.5]
        )

    results.append({
        "parameter": parameter,
        "rho": rho,
        "p_value": p_value,
        "ci_low": ci_low,
        "ci_high": ci_high,
    })

# Bonferroni correction for the four planned comparisons
number_of_tests = len(results)

for item in results:
    item["adjusted_p"] = min(
        item["p_value"] * number_of_tests, 1.0
    )

    print(f"\nParameter: {item['parameter']}")
    print(f"Spearman rho: {item['rho']:.3f}")
    print(f"P-value: {item['p_value']:.5f}")

    if np.isfinite(item["ci_low"]):
        print(
            "Exploratory 95% bootstrap CI: "
            f"[{item['ci_low']:.3f}, "
            f"{item['ci_high']:.3f}]"
        )
    else:
        print("Bootstrap CI: Could not estimate reliably")

    print(
        "Bonferroni-adjusted p-value: "
        f"{item['adjusted_p']:.5f}"
    )

    if item["adjusted_p"] < 0.05:
        print("Result: Significant under this test's assumptions.")
    else:
        print("Result: Not significant under this test.")

print("\nAnalysis complete.")
import math
from scipy.stats import t


# Non-overlapping seasonal analysis results
# Format: Parameter, Pearson correlation
correlations = {
    "Temperature": 0.557,
    "Precipitation": -0.253,
    "Humidity": -0.150,
    "Wind": 0.074
}

# Number of complete seasonal observations
n = 24

# Number of statistical tests
number_of_tests = len(correlations)


def calculate_significance(r, sample_size):
    """
    Calculate the approximate two-sided Pearson correlation
    p-value and 95% confidence interval using r and sample size.
    """

    degrees_of_freedom = sample_size - 2

    # Protect against an invalid correlation value
    if not -1 <= r <= 1:
        raise ValueError("Correlation must be between -1 and +1.")

    if sample_size < 4:
        raise ValueError("At least 4 observations are required.")

    # Calculate the t-statistic
    if abs(r) == 1:
        t_statistic = math.copysign(math.inf, r)
        p_value = 0.0
    else:
        t_statistic = r * math.sqrt(
            degrees_of_freedom / (1 - r**2)
        )

        # Two-sided p-value
        p_value = 2 * t.sf(
            abs(t_statistic),
            df=degrees_of_freedom
        )

    # Fisher z-transformation for the 95% confidence interval
    if abs(r) == 1:
        ci_lower = r
        ci_upper = r
    else:
        fisher_z = math.atanh(r)
        standard_error = 1 / math.sqrt(sample_size - 3)

        z_critical = 1.96

        ci_lower = math.tanh(
            fisher_z - z_critical * standard_error
        )

        ci_upper = math.tanh(
            fisher_z + z_critical * standard_error
        )

    return t_statistic, p_value, ci_lower, ci_upper


print("=" * 75)
print("EL NINO AI - STATISTICAL SIGNIFICANCE ANALYSIS")
print("=" * 75)

print(f"Sample size: {n}")
print("Confidence level: 95%")
print("Test: Two-sided Pearson correlation test")

for parameter, r in correlations.items():

    t_stat, p_value, ci_lower, ci_upper = (
        calculate_significance(r, n)
    )

    # Bonferroni adjustment for four comparisons
    adjusted_p = min(p_value * number_of_tests, 1.0)

    print(f"\nParameter: {parameter}")
    print(f"Pearson correlation: {r:.3f}")
    print(f"T-statistic: {t_stat:.3f}")
    print(f"P-value: {p_value:.4f}")
    print(
        f"95% Confidence Interval: "
        f"[{ci_lower:.3f}, {ci_upper:.3f}]"
    )
    print(f"Bonferroni-adjusted p-value: {adjusted_p:.4f}")

    if adjusted_p < 0.05:
        print("Result: Statistically significant under this test.")
    else:
        print("Result: Not statistically significant under this test.")
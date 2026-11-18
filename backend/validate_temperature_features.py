"""
Compare PostgreSQL-derived ERA5/RONI seasonal features with the
existing El Nino AI baseline CSV.

Run from the backend directory:
    python validate_temperature_features.py

This script is diagnostic only. It does not update/delete database rows,
modify the trained model, or overwrite any CSV.
"""

from pathlib import Path

import numpy as np
import pandas as pd

from database import get_db_connection


# ============================================================
# 1. CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

CSV_FILE = (
    BASE_DIR
    / "seasonal_validation_1950_2019_baseline_1981_2010.csv"
)

LOCATION_ID = 1

TOLERANCE = 1e-3

FEATURES = [
    "roni_value",
    "temperature_anomaly_3month_c",
    "precipitation_anomaly_3month_mm",
    "humidity_anomaly_pp",
    "wind_anomaly_kmh",
]


# ============================================================
# 2. DATABASE QUERY
# ============================================================

# Psycopg2 uses %s for bound parameters.
# SQL modulo operators are written %% when query parameters are used.

QUERY = """
WITH daily AS (
    SELECT
        EXTRACT(YEAR FROM observation_date)::int AS season_year,
        EXTRACT(MONTH FROM observation_date)::int AS month_num,
        observation_date,
        temperature_c,
        precipitation_mm,
        humidity_percent,
        wind_speed_kmh

    FROM historical_weather_observations

    WHERE location_id = %s
      AND model_name = 'era5'
      AND temperature_c IS NOT NULL
      AND precipitation_mm IS NOT NULL
      AND humidity_percent IS NOT NULL
      AND wind_speed_kmh IS NOT NULL
),

monthly_climatology AS (
    SELECT
        month_num,

        AVG(temperature_c) AS baseline_temp,
        AVG(precipitation_mm) AS baseline_precip_daily,
        AVG(humidity_percent) AS baseline_humidity,
        AVG(wind_speed_kmh) AS baseline_wind

    FROM daily

    WHERE observation_date >= DATE '1981-01-01'
      AND observation_date < DATE '2011-01-01'

    GROUP BY month_num
),

daily_anomalies AS (
    SELECT
        d.season_year,
        d.month_num,
        d.observation_date,

        d.temperature_c - c.baseline_temp
            AS temperature_anomaly_daily,

        d.precipitation_mm - c.baseline_precip_daily
            AS precipitation_anomaly_daily,

        d.humidity_percent - c.baseline_humidity
            AS humidity_anomaly_daily,

        d.wind_speed_kmh - c.baseline_wind
            AS wind_anomaly_daily

    FROM daily d

    JOIN monthly_climatology c
      ON c.month_num = d.month_num
),

seasonal_raw AS (
    SELECT
        season_year,

        CASE
            WHEN month_num BETWEEN 1 AND 3 THEN 'JFM'
            WHEN month_num BETWEEN 4 AND 6 THEN 'AMJ'
            WHEN month_num BETWEEN 7 AND 9 THEN 'JAS'
            ELSE 'OND'
        END AS season_label,

        COUNT(*) AS days_observed,

        COUNT(DISTINCT observation_date) AS unique_days,

        AVG(temperature_anomaly_daily)
            AS temperature_anomaly_3month_c,

        SUM(precipitation_anomaly_daily)
            AS precipitation_anomaly_3month_mm,

        AVG(humidity_anomaly_daily)
            AS humidity_anomaly_pp,

        AVG(wind_anomaly_daily)
            AS wind_anomaly_kmh

    FROM daily_anomalies

    WHERE season_year BETWEEN 1950 AND 2019

    GROUP BY
        season_year,

        CASE
            WHEN month_num BETWEEN 1 AND 3 THEN 'JFM'
            WHEN month_num BETWEEN 4 AND 6 THEN 'AMJ'
            WHEN month_num BETWEEN 7 AND 9 THEN 'JAS'
            ELSE 'OND'
        END
),

complete_seasons AS (
    SELECT *
    FROM seasonal_raw s

    WHERE days_observed = CASE
        WHEN season_label = 'JFM'
         AND (
             season_year %% 400 = 0
             OR (
                 season_year %% 4 = 0
                 AND season_year %% 100 <> 0
             )
         )
            THEN 91

        WHEN season_label = 'JFM' THEN 90
        WHEN season_label = 'AMJ' THEN 91
        ELSE 92
    END

    AND unique_days = days_observed
)

SELECT
    s.season_year,
    s.season_label,
    r.center_month,

    r.index_value_c::double precision AS roni_value,

    s.temperature_anomaly_3month_c,
    s.precipitation_anomaly_3month_mm,
    s.humidity_anomaly_pp,
    s.wind_anomaly_kmh

FROM complete_seasons s

JOIN enso_index_observations r
  ON r.season_year = s.season_year
 AND r.season_label = s.season_label
 AND r.index_name = 'RONI'

ORDER BY
    s.season_year,

    CASE s.season_label
        WHEN 'JFM' THEN 1
        WHEN 'AMJ' THEN 2
        WHEN 'JAS' THEN 3
        WHEN 'OND' THEN 4
    END;
"""


# ============================================================
# 3. HELPER FUNCTIONS
# ============================================================

def is_leap_year(year: int) -> bool:
    """Return True when year is a Gregorian leap year."""
    year = int(year)

    return (
        year % 400 == 0
        or (year % 4 == 0 and year % 100 != 0)
    )


def compare_features(
    frame: pd.DataFrame,
    features: list[str],
    tolerance: float,
) -> bool:
    """
    Compare raw database features against CSV features.

    Returns True only when every comparable value is within tolerance.
    """

    all_pass = True

    for feature in features:

        reference = frame[
            f"{feature}_csv"
        ].to_numpy(dtype=float)

        candidate = frame[
            f"{feature}_db"
        ].to_numpy(dtype=float)

        valid = (
            np.isfinite(reference)
            & np.isfinite(candidate)
        )

        if not valid.any():
            print(
                f"{feature}: no comparable numeric values"
            )
            all_pass = False
            continue

        differences = np.abs(
            reference[valid] - candidate[valid]
        )

        pass_count = int(
            (differences <= tolerance).sum()
        )

        count = int(valid.sum())

        feature_pass = pass_count == count

        all_pass = all_pass and feature_pass

        print(
            f"{feature}: {pass_count}/{count} within tolerance; "
            f"mean_abs_diff={differences.mean():.9f}; "
            f"max_abs_diff={differences.max():.9f}; "
            f"{'PASS' if feature_pass else 'MISMATCH'}"
        )

    return all_pass
# ============================================================
# 4. MAIN VALIDATION
# ============================================================

def main() -> int:

    # --------------------------------------------------------
    # A. Load and validate the training-source CSV
    # --------------------------------------------------------

    if not CSV_FILE.exists():
        print(
            f"ERROR: Baseline CSV not found: {CSV_FILE}"
        )
        return 1

    csv_df = pd.read_csv(CSV_FILE)

    required = {
        "season_year",
        "season_label",
        *FEATURES,
    }

    missing = required - set(csv_df.columns)

    if missing:
        print(
            "ERROR: CSV is missing required columns: "
            f"{sorted(missing)}"
        )
        return 1

    csv_df["season_year"] = pd.to_numeric(
        csv_df["season_year"],
        errors="coerce",
    )

    for column in FEATURES:
        csv_df[column] = pd.to_numeric(
            csv_df[column],
            errors="coerce",
        )

    csv_df["season_label"] = (
        csv_df["season_label"]
        .astype(str)
        .str.strip()
    )

    csv_df = csv_df.dropna(
        subset=["season_year", "season_label"]
    ).copy()

    csv_df["season_year"] = (
        csv_df["season_year"].astype(int)
    )

    # --------------------------------------------------------
    # B. Retrieve ERA5 and RONI features from PostgreSQL
    # --------------------------------------------------------

    connection = None

    try:
        connection = get_db_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                QUERY,
                (LOCATION_ID,),
            )

            rows = cursor.fetchall()

            columns = [
                description[0]
                for description in cursor.description
            ]

        db_df = pd.DataFrame(
            rows,
            columns=columns,
        )

    except Exception as exc:
        print(
            f"ERROR: Could not query PostgreSQL: {exc}"
        )
        raise

    finally:
        if connection is not None:
            connection.close()

    db_df["season_year"] = pd.to_numeric(
        db_df["season_year"],
        errors="coerce",
    )

    for column in FEATURES:
        db_df[column] = pd.to_numeric(
            db_df[column],
            errors="coerce",
        )

    db_df["season_label"] = (
        db_df["season_label"]
        .astype(str)
        .str.strip()
    )

    db_df = db_df.dropna(
        subset=["season_year", "season_label"]
    ).copy()

    db_df["season_year"] = (
        db_df["season_year"].astype(int)
    )

    # --------------------------------------------------------
    # C. Check duplicate seasonal records
    # --------------------------------------------------------

    keys = [
        "season_year",
        "season_label",
    ]

    duplicate_csv = csv_df.duplicated(
        keys,
        keep=False,
    )

    duplicate_db = db_df.duplicated(
        keys,
        keep=False,
    )

    print("=" * 76)
    print("EL NINO AI — DATABASE FEATURE VALIDATION")
    print("=" * 76)

    print(
        f"Database location_id: {LOCATION_ID} (ERA5)"
    )

    print(
        f"CSV rows: {len(csv_df)} | "
        f"Database seasonal rows: {len(db_df)}"
    )

    print(
        "Duplicate CSV season keys: "
        f"{int(duplicate_csv.sum())}"
    )

    print(
        "Duplicate DB season keys: "
        f"{int(duplicate_db.sum())}"
    )

    if duplicate_csv.any() or duplicate_db.any():
        print(
            "ERROR: Duplicate (season_year, season_label) "
            "keys found; comparison is ambiguous."
        )
        return 2

    # --------------------------------------------------------
    # D. Match CSV seasons to database seasons
    # --------------------------------------------------------

    merged = csv_df.merge(
        db_df[keys + FEATURES],
        on=keys,
        how="inner",
        suffixes=("_csv", "_db"),
        validate="one_to_one",
    )

    print(
        f"Common seasons compared: {len(merged)}"
    )

    if merged.empty:
        print(
            "ERROR: No overlapping seasons could be compared."
        )
        return 2

    # --------------------------------------------------------
    # E. Raw feature comparison
    # --------------------------------------------------------

    print(
        f"\nFeature comparison "
        f"(absolute tolerance: {TOLERANCE:g})"
    )

    print("-" * 76)

    all_pass = compare_features(
        merged,
        FEATURES,
        TOLERANCE,
    )

    # --------------------------------------------------------
    # F. Show the 10 largest temperature differences
    # --------------------------------------------------------

    temp_diff = (
        merged["temperature_anomaly_3month_c_csv"]
        - merged["temperature_anomaly_3month_c_db"]
    ).abs()

    largest = merged.loc[
        temp_diff.nlargest(10).index,
        keys + [
            "temperature_anomaly_3month_c_csv",
            "temperature_anomaly_3month_c_db",
        ],
    ].copy()

    largest["absolute_difference"] = (
        largest["temperature_anomaly_3month_c_csv"]
        - largest["temperature_anomaly_3month_c_db"]
    ).abs()

    print(
        "\nLargest temperature-anomaly differences:"
    )

    print(
        largest.to_string(
            index=False,
            float_format=lambda value: f"{value:.9f}",
        )
    )

    # --------------------------------------------------------
    # G. Raw mismatch breakdown by season
    # --------------------------------------------------------

    print(
        "\nMismatch breakdown by season "
        "(raw database values):"
    )

    for feature in FEATURES:

        signed_diff = (
            merged[f"{feature}_csv"]
            - merged[f"{feature}_db"]
        )

        report = pd.DataFrame({
            "season_label": merged["season_label"],
            "signed_diff": signed_diff,
            "abs_diff": signed_diff.abs(),
        })

        report["outside_tolerance"] = (
            report["abs_diff"] > TOLERANCE
        )

        summary = (
            report.groupby("season_label")
            .agg(
                rows=("abs_diff", "size"),
                mismatches=("outside_tolerance", "sum"),
                mean_signed_diff=("signed_diff", "mean"),
                mean_abs_diff=("abs_diff", "mean"),
                max_abs_diff=("abs_diff", "max"),
            )
            .reindex(["JFM", "AMJ", "JAS", "OND"])
        )

        print(f"\nFeature: {feature}")

        print(
            summary.to_string(
                float_format=lambda value: f"{value:.9f}"
            )
        )

    # --------------------------------------------------------
    # H. JFM differences grouped by leap-year status
    # --------------------------------------------------------

    jfm = merged.loc[
        merged["season_label"].eq("JFM")
    ].copy()

    jfm["leap_year"] = (
        jfm["season_year"].map(is_leap_year)
    )

    print(
        "\nJFM differences grouped by leap-year status "
        "(CSV - DB):"
    )

    for feature in FEATURES:

        diagnostic = pd.DataFrame({
            "leap_year": jfm["leap_year"].to_numpy(),

            "difference": (
                jfm[f"{feature}_csv"]
                - jfm[f"{feature}_db"]
            ).to_numpy(),
        })

        summary = diagnostic.groupby(
            "leap_year"
        )["difference"].agg(
            ["count", "mean", "std", "min", "max"]
        )

        print(f"\nFeature: {feature}")

        print(
            summary.to_string(
                float_format=lambda value: f"{value:.9f}"
            )
        )

    # --------------------------------------------------------
    # I. Inspect the baseline reference years alone
    # --------------------------------------------------------

    baseline_jfm = jfm.loc[
        jfm["season_year"].between(1981, 2010)
    ].copy()

    print(
        "\nJFM reference-period differences "
        "(1981-2010, CSV - DB):"
    )

    print(
        f"Reference seasons: {len(baseline_jfm)}"
    )

    for feature in FEATURES:

        diagnostic = pd.DataFrame({
            "leap_year": baseline_jfm["leap_year"].to_numpy(),

            "difference": (
                baseline_jfm[f"{feature}_csv"]
                - baseline_jfm[f"{feature}_db"]
            ).to_numpy(),
        })

        summary = diagnostic.groupby(
            "leap_year"
        )["difference"].agg(
            ["count", "mean", "std", "min", "max"]
        )

        print(f"\nFeature: {feature}")

        print(
            summary.to_string(
                float_format=lambda value: f"{value:.9f}"
            )
        )

    # --------------------------------------------------------
    # J. Candidate calibration diagnostic only
    # --------------------------------------------------------

    # IMPORTANT:
    # Calibration is tested on a copy of merged.
    # No database values, CSV files, or production features
    # are modified by this diagnostic.

    calibrated = merged.copy()

    years = calibrated["season_year"].astype(int)

    leap_flags = years.map(is_leap_year)

    jfm_mask = calibrated["season_label"].eq("JFM")

    baseline_mask = (
        jfm_mask
        & years.between(1981, 2010)
    )

    holdout_mask = ~years.between(1981, 2010)

    print(
        "\nCandidate JFM calibration — validation only:"
    )

    correction_features = [
        "precipitation_anomaly_3month_mm",
        "humidity_anomaly_pp",
    ]

    for feature in correction_features:

        for leap_status in (False, True):

            fit_mask = (
                baseline_mask
                & leap_flags.eq(leap_status)
            )

            apply_mask = (
                jfm_mask
                & leap_flags.eq(leap_status)
            )

            if not fit_mask.any():
                print(
                    f"WARNING: No baseline rows for "
                    f"{feature}, leap_year={leap_status}"
                )
                continue

            offset = (
                calibrated.loc[
                    fit_mask,
                    f"{feature}_csv",
                ]
                - calibrated.loc[
                    fit_mask,
                    f"{feature}_db",
                ]
            ).mean()

            calibrated.loc[
                apply_mask,
                f"{feature}_db",
            ] += offset

            print(
                f"{feature} | leap_year={leap_status} "
                f"| baseline rows={int(fit_mask.sum())} "
                f"| offset={offset:.9f}"
            )

    # --------------------------------------------------------
    # K. Evaluate calibrated copy outside the baseline years
    # --------------------------------------------------------

    print(
        "\nOut-of-baseline validation "
        "(years outside 1981-2010; calibrated copy):"
    )

    holdout_df = calibrated.loc[
        holdout_mask
    ].copy()

    for feature in FEATURES:

        reference = holdout_df[
            f"{feature}_csv"
        ].to_numpy(dtype=float)

        candidate = holdout_df[
            f"{feature}_db"
        ].to_numpy(dtype=float)

        valid = (
            np.isfinite(reference)
            & np.isfinite(candidate)
        )

        differences = np.abs(
            reference[valid] - candidate[valid]
        )

        if len(differences) == 0:
            print(
                f"{feature}: no comparable holdout rows"
            )
            continue

        passed = int(
            (differences <= TOLERANCE).sum()
        )

        print(
            f"{feature}: {passed}/{len(differences)} "
            f"within tolerance; "
            f"mean_abs_diff={differences.mean():.9f}; "
            f"max_abs_diff={differences.max():.9f}"
        )

    # --------------------------------------------------------
    # L. Conclusion
    # --------------------------------------------------------

    print("\nConclusion:")

    if all_pass:
        print(
            "All raw database features are within tolerance "
            "for every overlapping season. This supports the "
            "candidate calculation, but it does not independently "
            "prove the data sources and scientific definitions "
            "are identical."
        )
        return 0

    print(
        "At least one raw feature differs from the training-source "
        "CSV. The calibration section is diagnostic only. Do not "
        "apply offsets to the production endpoint until the "
        "scientific feature definitions are confirmed."
    )

    return 2


# ============================================================
# 5. SCRIPT ENTRY POINT
# ============================================================

if __name__ == "__main__":

    try:
        raise SystemExit(main())

    except KeyboardInterrupt:
        print("\nValidation cancelled.")
        raise SystemExit(130)
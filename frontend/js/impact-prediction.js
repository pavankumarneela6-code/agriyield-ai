// ======================================================
// EL NIÑO AI
// Ridge Regression Temperature Prediction
// Uses latest available PostgreSQL ERA5 + RONI inputs
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = "http://127.0.0.1:8000";
    const tr = (key, params = {}) => window.ImpactPredictionI18n
        ? window.ImpactPredictionI18n.t(key, params)
        : key;
    const setText = (elementOrId, key, params = {}) => {
        if (window.ImpactPredictionI18n) {
            window.ImpactPredictionI18n.setText(elementOrId, key, params);
        } else {
            const element = typeof elementOrId === "string"
                ? document.getElementById(elementOrId)
                : elementOrId;
            if (element) element.textContent = tr(key, params);
        }
    };
    const LOCATION_ID = 1;

    const form = document.getElementById("temperaturePredictionForm");
    const predictButton = document.getElementById("predictButton");
    const messageElement = document.getElementById("predictionMessage");
    const resultPanel = document.getElementById("predictionResult");
    const statusText = document.getElementById("modelStatusText");
    const statusDot = document.getElementById("modelStatusDot");
    const databaseNotice = document.getElementById("predictionNotice")
        || document.querySelector(".prediction-notice");

    const inputNames = [
        "roni_value",
        "roni_previous_season",
        "temperature_anomaly_3month_c",
        "temperature_anomaly_previous_season_c",
        "precipitation_anomaly_3month_mm",
        "humidity_anomaly_pp",
        "wind_anomaly_kmh",
        "season_month"
    ];

    let databaseInputsLoaded = false;
    let latestInputMetadata = null;

    // Do not allow the example/default values to be submitted before the
    // real database inputs have been loaded successfully.
    predictButton.disabled = true;
    setText(predictButton, "buttonLoadingDb");

    // --------------------------------------------------
    // 1. Display status messages
    // --------------------------------------------------
    function showMessage(message, type = "") {
        if (arguments.length >= 3 && typeof arguments[2] === "string" && arguments[2]) {
            setText(messageElement, arguments[2], arguments[3] || {});
        } else {
            messageElement.textContent = message || "";
            delete messageElement.dataset.i18nDynamic;
            delete messageElement.dataset.i18nParams;
        }
        messageElement.className = "prediction-message";

        if (type) {
            messageElement.classList.add(type);
        }
    }

    function getApiErrorMessage(data, fallback) {
        const detail = data?.detail;
        if (typeof detail === "string") return detail;
        if (detail) return JSON.stringify(detail);
        return fallback;
    }

    // --------------------------------------------------
    // 2. Check whether the ML model is loaded
    // --------------------------------------------------
    async function checkModelStatus() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/ml/temperature/status`,
                { cache: "no-store" }
            );

            const data = await response.json();

            if (!response.ok || data.model_loaded !== true) {
                throw new Error(
                    data.detail || tr("modelUnavailable")
                );
            }

            setText(statusText, "statusModelOnline");
            statusDot.className = "status-dot online";
        } catch (error) {
            setText(statusText, "statusModelOffline");
            statusDot.className = "status-dot offline";
            console.error("Model status check failed:", error);
        }
    }

    // --------------------------------------------------
    // 3. Load current model inputs from PostgreSQL via FastAPI
    // --------------------------------------------------
    async function loadLatestDatabaseInputs() {
        databaseInputsLoaded = false;
        predictButton.disabled = true;
        setText(predictButton, "buttonLoadingDb");

        if (databaseNotice) {
            setText(databaseNotice, "noticeLoadingDb");
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/ml/temperature/latest-inputs?location_id=${LOCATION_ID}`,
                { cache: "no-store" }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getApiErrorMessage(data, tr("couldNotLoadDb"))
                );
            }

            if (data.success !== true || !data.inputs) {
                throw new Error(tr("unexpectedDbResponse"));
            }

            // Validate every required field before filling the form.
            for (const name of inputNames) {
                const field = form.elements.namedItem(name);
                const rawValue = data.inputs[name];
                const numericValue = Number(rawValue);

                if (!field) {
                    throw new Error(tr("formMissingField", { field: name }));
                }

                if (rawValue === null || rawValue === undefined ||
                    rawValue === "" || !Number.isFinite(numericValue)) {
                    throw new Error(tr("invalidDbValue", { field: name }));
                }

                field.value = String(rawValue);
            }

            latestInputMetadata = {
                latest_available_season: data.latest_available_season || null,
                target_season: data.target_season || null,
                baseline_period: data.baseline_period || "1981-2010",
                weather_source: data.weather_source || "ERA5",
                roni_source: data.roni_source || "RONI"
            };

            databaseInputsLoaded = true;
            predictButton.disabled = false;
            setText(predictButton, "buttonRunPrediction");

            const latest = latestInputMetadata.latest_available_season;
            const target = latestInputMetadata.target_season;
            const latestLabel = latest
                ? `${latest.label} ${latest.year}`
                : tr("latestAvailableSeason");
            const targetLabel = target
                ? `${target.label} ${target.year}`
                : tr("nextSelectedSeason");

            if (databaseNotice) {
                setText(databaseNotice, "noticeLoadedDb", {
                    weatherSource: latestInputMetadata.weather_source,
                    roniSource: latestInputMetadata.roni_source,
                    latestLabel,
                    targetLabel
                });
            }

            setText(messageElement, "messageLoadedDb", { latestLabel, targetLabel });
            messageElement.className = "prediction-message success";

            console.log("Latest temperature-prediction inputs loaded:", data);
        } catch (error) {
            databaseInputsLoaded = false;
            latestInputMetadata = null;
            predictButton.disabled = true;
            setText(predictButton, "dbUnavailable");

            if (databaseNotice) {
                setText(databaseNotice, "noticeDbUnavailable");
            }

            if (error.message.includes("Failed to fetch")) {
                showMessage("", "error", "cannotConnectApi");
            } else {
                showMessage("", "error", "dbInputFailure", { message: error.message });
            }

            console.error("Database input loading failed:", error);
        }
    }

    // --------------------------------------------------
    // 4. Format numeric values
    // --------------------------------------------------
    function formatNumber(value, digits = 4) {
        const number = Number(value);
        if (!Number.isFinite(number)) return tr("notAvailable");
        return number.toFixed(digits);
    }

    function formatSignedAnomaly(value) {
        const number = Number(value);
        if (!Number.isFinite(number)) return tr("notAvailable");
        const sign = number > 0 ? "+" : "";
        return sign + number.toFixed(3) + " °C";
    }

    // --------------------------------------------------
    // 5. Display the prediction result
    // --------------------------------------------------
    function displayPrediction(data) {
        document.getElementById("predictedAnomaly").textContent =
            formatSignedAnomaly(data.predicted_temperature_anomaly_c);

        const target = latestInputMetadata?.target_season;
        const targetSeason = target ? `${target.label} ${target.year}` : "";
        const hasTargetSeason = Boolean(targetSeason);

        setText("predictionTarget", hasTargetSeason ? "predictionTargetWithSeason" : "predictionTargetNoSeason", {
            target: data.target || tr("temperatureAnomalyEstimate"),
            season: targetSeason
        });

        document.getElementById("modelMAE").textContent =
            formatNumber(data.model_test_mae_c);
        document.getElementById("modelRMSE").textContent =
            formatNumber(data.model_test_rmse_c);
        document.getElementById("modelR2").textContent =
            formatNumber(data.model_test_r2);
        document.getElementById("modelAlpha").textContent =
            data.selected_alpha ?? tr("notAvailable");
        document.getElementById("modelBaseline").textContent =
            data.baseline_period || latestInputMetadata?.baseline_period || tr("notAvailable");
        if (data.note) {
            document.getElementById("predictionDisclaimer").textContent = data.note;
            delete document.getElementById("predictionDisclaimer").dataset.i18nDynamic;
            delete document.getElementById("predictionDisclaimer").dataset.i18nParams;
        } else {
            setText("predictionDisclaimer", "experimentalDisclaimer");
        }

        resultPanel.hidden = false;
        resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // --------------------------------------------------
    // 6. Submit form to FastAPI
    // --------------------------------------------------
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!databaseInputsLoaded) {
            showMessage("", "error", "predictionDisabled");
            return;
        }

        showMessage("");
        predictButton.disabled = true;
        setText(predictButton, "buttonCalculating");

        try {
            const requestData = {};

            for (const name of inputNames) {
                const field = form.elements.namedItem(name);
                const value = Number(field.value);

                if (field.value.trim() === "" || !Number.isFinite(value)) {
                    const fieldLabelKeys = {
                        roni_value: "labelRoniCurrent",
                        roni_previous_season: "labelRoniPrevious",
                        temperature_anomaly_3month_c: "labelTemperature3Month",
                        temperature_anomaly_previous_season_c: "labelTemperaturePrevious",
                        precipitation_anomaly_3month_mm: "labelPrecipitation3Month",
                        humidity_anomaly_pp: "labelHumidityAnomaly",
                        wind_anomaly_kmh: "labelWindAnomaly",
                        season_month: "labelSeasonMonth"
                    };
                    const error = new Error(tr("pleaseEnterNumber", {
                        field: tr(fieldLabelKeys[name] || name)
                    }));
                    error.translationKey = "pleaseEnterNumber";
                    error.translationParams = { fieldKey: fieldLabelKeys[name] || name };
                    throw error;
                }

                requestData[name] = value;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/ml/temperature/predict`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getApiErrorMessage(data, tr("predictionRequestFailed"))
                );
            }

            if (
                typeof data.predicted_temperature_anomaly_c !== "number" ||
                !Number.isFinite(data.predicted_temperature_anomaly_c)
            ) {
                const error = new Error(tr("invalidPrediction"));
                error.translationKey = "invalidPrediction";
                throw error;
            }

            displayPrediction(data);
            setText(messageElement, "predictionSuccess");
            messageElement.className = "prediction-message success";

            console.log("Temperature prediction response:", data);
        } catch (error) {
            console.error("Temperature prediction failed:", error);

            if (error.message.includes("Failed to fetch")) {
                showMessage("", "error", "cannotConnectPrediction");
            } else if (error.translationKey === "pleaseEnterNumber") {
                showMessage("", "error", error.translationKey, {
                    field: tr(error.translationParams.fieldKey)
                });
            } else if (error.translationKey) {
                showMessage("", "error", error.translationKey);
            } else {
                showMessage(error.message, "error");
            }
        } finally {
            predictButton.disabled = !databaseInputsLoaded;
            setText(predictButton, databaseInputsLoaded
                ? "buttonRunPrediction"
                : "dbUnavailable");
        }
    });

    // --------------------------------------------------
    // 7. Reset form to latest database values, not demo values
    // --------------------------------------------------
    form.addEventListener("reset", () => {
        resultPanel.hidden = true;
        databaseInputsLoaded = false;
        predictButton.disabled = true;
        setText(predictButton, "buttonReloadDb");
        setText(messageElement, "reloadingDbMessage");

        // Let the browser perform its native reset first, then replace
        // those defaults with database values.
        window.setTimeout(loadLatestDatabaseInputs, 0);
    });

    // --------------------------------------------------
    // 8. Initialize the page
    // --------------------------------------------------
    checkModelStatus();
    loadLatestDatabaseInputs();

    console.log("El Niño AI: Temperature prediction page initialized.");
});

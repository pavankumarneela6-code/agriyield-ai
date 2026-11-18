/* =========================================================
   Impact Prediction page translations (English / Telugu)
   Page-only language preference: elninoImpactPredictionLanguage
========================================================= */
(() => {
    "use strict";

    const STORAGE_KEY = "elninoImpactPredictionLanguage";

    const dictionaries = {
        en: {
            documentTitle: "Temperature Prediction | El Niño AI",
            languageLabel: "Language",
            navHome: "Home", navEnso: "El Niño Analysis", navClimate: "Climate Analysis",
            navPredictions: "Predictions", navHistory: "Historical Data",
            headingEyebrow: "Machine Learning · Temperature Analysis",
            headingTemperature: "Temperature", headingPrediction: "Prediction",
            headingIntro: "Explore an experimental Ridge Regression model that estimates temperature anomalies using historical ENSO indicators and regional climate features.",
            statusCheckingModel: "Checking model availability...",
            inputTitle: "Climate Input Parameters",
            inputDescription: "Climate inputs load automatically from the latest complete ERA5 season and its matching RONI record. Review the values before running the experimental prediction.",
            labelRoniCurrent: "Current RONI value", helpEnsoIndex: "ENSO-related index",
            labelRoniPrevious: "Previous-season RONI",
            labelTemperature3Month: "3-month temperature anomaly (°C)",
            labelTemperaturePrevious: "Previous-season temperature anomaly (°C)",
            labelPrecipitation3Month: "3-month precipitation anomaly (mm)",
            labelHumidityAnomaly: "Humidity anomaly", helpPercentagePoints: "Percentage-point anomaly",
            labelWindAnomaly: "Wind-speed anomaly (km/h)", labelSeasonMonth: "Input-season reference month",
            monthJan: "January", monthFeb: "February", monthMar: "March", monthApr: "April",
            monthMay: "May", monthJun: "June", monthJul: "July", monthAug: "August",
            monthSep: "September", monthOct: "October", monthNov: "November", monthDec: "December",
            buttonRun: "Run Temperature Prediction", buttonReset: "Reset Inputs",
            noticeLoadingInputs: "Loading historical ERA5 weather and RONI inputs from PostgreSQL. These are the latest available historical inputs, not live weather measurements.",
            modelHowTitle: "How the model works",
            modelHowDescription: "Ridge Regression estimates a numerical temperature anomaly from the supplied climate features.",
            featureClimateTitle: "Climate indicators",
            featureClimateDescription: "Uses RONI, temperature, precipitation, humidity, and wind anomalies.",
            featureSeasonTitle: "Seasonal information",
            featureSeasonDescription: "Encodes the reference month using seasonal sine and cosine features.",
            featureAnomalyTitle: "Temperature anomaly",
            featureAnomalyDescription: "Returns an estimated anomaly in degrees Celsius, relative to the model's specified baseline.",
            resultKicker: "Prediction received from API", resultTitle: "Estimated Temperature Anomaly",
            metricMae: "Historical Test MAE", metricRmse: "Historical Test RMSE", metricR2: "Test R²",
            metricAlpha: "Selected Alpha", baselinePeriod: "Baseline period:",
            footerTitle: "El Niño AI · Climate Intelligence & Impact Prediction System",
            footerNote: "Experimental model output is for research and informational purposes. It is not an official weather forecast.",
            statusModelOnline: "Ridge Regression model is online",
            statusModelOffline: "Unable to verify model connection",
            modelUnavailable: "The temperature model is not available.",
            noticeLoadingDb: "Loading the latest complete seasonal inputs from PostgreSQL (ERA5 weather + RONI)...",
            couldNotLoadDb: "Could not load database inputs.",
            unexpectedDbResponse: "The database-input API returned an unexpected response.",
            formMissingField: "The form is missing the field '{field}'.",
            invalidDbValue: "The database API returned an invalid value for '{field}'.",
            buttonLoadingDb: "Loading Database Inputs...", buttonRunPrediction: "Run Temperature Prediction",
            latestAvailableSeason: "latest available season", nextSelectedSeason: "the next selected season",
            noticeLoadedDb: "Database inputs loaded from {weatherSource} weather and {roniSource}. Latest available input season: {latestLabel}. Prediction target: {targetLabel}. Weather records currently available in this database end in December 2025; these are historical inputs, not live 2026 observations.",
            messageLoadedDb: "Loaded database inputs for {latestLabel}. Prediction target: {targetLabel}. Review the values before running the model.",
            noticeDbUnavailable: "Could not load historical inputs from PostgreSQL. Example values must not be treated as current weather data, so prediction is disabled until the database-input API succeeds.",
            dbUnavailable: "Database Inputs Unavailable", dbInputFailure: "Could not load database inputs: {message}",
            cannotConnectApi: "Cannot connect to the API. Check that FastAPI is running and CORS allows your frontend address.",
            notAvailable: "Not available", temperatureAnomalyEstimate: "Temperature anomaly estimate",
            predictionTargetWithSeason: "{target}. Database-derived target season: {season}. This is an estimated anomaly, not an absolute air temperature.",
            predictionTargetNoSeason: "{target}. This is an estimated anomaly, not an absolute air temperature.",
            experimentalDisclaimer: "Experimental estimate. Do not use as an official weather forecast.",
            predictionDisabled: "Prediction is disabled until real database inputs load successfully.",
            buttonCalculating: "Calculating Prediction...", predictionRequestFailed: "The prediction request failed.",
            invalidPrediction: "The API response did not contain a valid temperature prediction.",
            predictionSuccess: "Prediction received successfully from the FastAPI backend using the values currently shown in the form.",
            cannotConnectPrediction: "Cannot connect to the prediction API. Check that FastAPI is running and CORS allows your frontend address.",
            pleaseEnterNumber: "Please enter a valid number for {field}.", buttonReloadDb: "Reloading Database Inputs...",
            reloadingDbMessage: "Reloading the latest database inputs..."
        },
        te: {
            documentTitle: "ఉష్ణోగ్రత అంచనా | El Niño AI",
            languageLabel: "భాష",
            navHome: "హోమ్", navEnso: "ఎల్ నినో విశ్లేషణ", navClimate: "వాతావరణ విశ్లేషణ",
            navPredictions: "అంచనాలు", navHistory: "చారిత్రక డేటా",
            headingEyebrow: "మెషిన్ లెర్నింగ్ · ఉష్ణోగ్రత విశ్లేషణ",
            headingTemperature: "ఉష్ణోగ్రత", headingPrediction: "అంచనా",
            headingIntro: "చారిత్రక ENSO సూచికలు మరియు ప్రాంతీయ వాతావరణ లక్షణాలను ఉపయోగించి ఉష్ణోగ్రత వ్యత్యాసాన్ని అంచనా వేసే ప్రయోగాత్మక Ridge Regression మోడల్‌ను పరిశీలించండి.",
            statusCheckingModel: "మోడల్ అందుబాటును తనిఖీ చేస్తోంది...",
            inputTitle: "వాతావరణ ఇన్‌పుట్ విలువలు",
            inputDescription: "తాజాగా పూర్తయిన ERA5 సీజన్ మరియు దానికి సరిపోలే RONI రికార్డు నుంచి వాతావరణ విలువలు ఆటోమేటిక్‌గా లోడ్ అవుతాయి. ప్రయోగాత్మక అంచనాను ప్రారంభించే ముందు విలువలను పరిశీలించండి.",
            labelRoniCurrent: "ప్రస్తుత RONI విలువ", helpEnsoIndex: "ENSO సంబంధిత సూచిక",
            labelRoniPrevious: "మునుపటి సీజన్ RONI",
            labelTemperature3Month: "3 నెలల ఉష్ణోగ్రత వ్యత్యాసం (°C)",
            labelTemperaturePrevious: "మునుపటి సీజన్ ఉష్ణోగ్రత వ్యత్యాసం (°C)",
            labelPrecipitation3Month: "3 నెలల వర్షపాతం వ్యత్యాసం (mm)",
            labelHumidityAnomaly: "తేమ వ్యత్యాసం", helpPercentagePoints: "శాతపు పాయింట్లలో వ్యత్యాసం",
            labelWindAnomaly: "గాలి వేగ వ్యత్యాసం (km/h)", labelSeasonMonth: "ఇన్‌పుట్ సీజన్ సూచన నెల",
            monthJan: "జనవరి", monthFeb: "ఫిబ్రవరి", monthMar: "మార్చి", monthApr: "ఏప్రిల్",
            monthMay: "మే", monthJun: "జూన్", monthJul: "జూలై", monthAug: "ఆగస్టు",
            monthSep: "సెప్టెంబర్", monthOct: "అక్టోబర్", monthNov: "నవంబర్", monthDec: "డిసెంబర్",
            buttonRun: "ఉష్ణోగ్రత అంచనా వేయి", buttonReset: "విలువలను రీసెట్ చేయి",
            noticeLoadingInputs: "PostgreSQL నుంచి చారిత్రక ERA5 వాతావరణం మరియు RONI విలువలను లోడ్ చేస్తోంది. ఇవి ప్రస్తుతం అందుబాటులో ఉన్న తాజా చారిత్రక విలువలు; ప్రత్యక్ష వాతావరణ కొలతలు కావు.",
            modelHowTitle: "మోడల్ ఎలా పనిచేస్తుంది",
            modelHowDescription: "ఇచ్చిన వాతావరణ లక్షణాల ఆధారంగా Ridge Regression సంఖ్యాత్మక ఉష్ణోగ్రత వ్యత్యాసాన్ని అంచనా వేస్తుంది.",
            featureClimateTitle: "వాతావరణ సూచికలు",
            featureClimateDescription: "RONI, ఉష్ణోగ్రత, వర్షపాతం, తేమ మరియు గాలి వ్యత్యాసాలను ఉపయోగిస్తుంది.",
            featureSeasonTitle: "సీజన్ సమాచారం",
            featureSeasonDescription: "సూచన నెలను సీజనల్ sine మరియు cosine లక్షణాలుగా మారుస్తుంది.",
            featureAnomalyTitle: "ఉష్ణోగ్రత వ్యత్యాసం",
            featureAnomalyDescription: "మోడల్ నిర్దేశించిన baseline‌తో పోలిస్తే డిగ్రీల సెల్సియస్‌లో అంచనా వ్యత్యాసాన్ని ఇస్తుంది.",
            resultKicker: "API నుంచి అంచనా అందింది", resultTitle: "అంచనా వేసిన ఉష్ణోగ్రత వ్యత్యాసం",
            metricMae: "చారిత్రక పరీక్ష MAE", metricRmse: "చారిత్రక పరీక్ష RMSE", metricR2: "పరీక్ష R²",
            metricAlpha: "ఎంచుకున్న Alpha", baselinePeriod: "Baseline కాలం:",
            footerTitle: "El Niño AI · వాతావరణ మేధస్సు మరియు ప్రభావ అంచనా వ్యవస్థ",
            footerNote: "ఈ ప్రయోగాత్మక మోడల్ ఫలితాలు పరిశోధన మరియు సమాచార ప్రయోజనాల కోసం మాత్రమే. ఇది అధికారిక వాతావరణ సూచన కాదు.",
            statusModelOnline: "Ridge Regression మోడల్ పనిచేస్తోంది",
            statusModelOffline: "మోడల్ కనెక్షన్‌ను నిర్ధారించలేకపోయాం",
            modelUnavailable: "ఉష్ణోగ్రత మోడల్ ప్రస్తుతం అందుబాటులో లేదు.",
            noticeLoadingDb: "PostgreSQL నుంచి తాజా పూర్తి సీజన్ ఇన్‌పుట్‌లను (ERA5 వాతావరణం + RONI) లోడ్ చేస్తోంది...",
            couldNotLoadDb: "డేటాబేస్ ఇన్‌పుట్‌లను లోడ్ చేయలేకపోయాం.",
            unexpectedDbResponse: "డేటాబేస్ ఇన్‌పుట్ API నుంచి ఊహించని స్పందన వచ్చింది.",
            formMissingField: "ఫారమ్‌లో '{field}' ఫీల్డ్ లేదు.",
            invalidDbValue: "డేటాబేస్ API '{field}' కోసం చెల్లని విలువను ఇచ్చింది.",
            buttonLoadingDb: "డేటాబేస్ విలువలు లోడ్ అవుతున్నాయి...", buttonRunPrediction: "ఉష్ణోగ్రత అంచనా వేయి",
            latestAvailableSeason: "తాజాగా అందుబాటులో ఉన్న సీజన్", nextSelectedSeason: "తదుపరి ఎంచుకున్న సీజన్",
            noticeLoadedDb: "ఇన్‌పుట్‌లు {weatherSource} వాతావరణం మరియు {roniSource} నుంచి లోడ్ అయ్యాయి. అందుబాటులో ఉన్న తాజా ఇన్‌పుట్ సీజన్: {latestLabel}. అంచనా లక్ష్య సీజన్: {targetLabel}. ఈ డేటాబేస్‌లోని వాతావరణ రికార్డులు డిసెంబర్ 2025 వరకు మాత్రమే ఉన్నాయి; ఇవి చారిత్రక విలువలు, 2026 ప్రత్యక్ష పరిశీలనలు కావు.",
            messageLoadedDb: "{latestLabel} కోసం డేటాబేస్ ఇన్‌పుట్‌లు లోడ్ అయ్యాయి. అంచనా లక్ష్యం: {targetLabel}. మోడల్‌ను అమలు చేసే ముందు విలువలను పరిశీలించండి.",
            noticeDbUnavailable: "PostgreSQL నుంచి చారిత్రక ఇన్‌పుట్‌లను లోడ్ చేయలేకపోయాం. ఉదాహరణ విలువలను ప్రస్తుత వాతావరణ డేటాగా భావించకూడదు; డేటాబేస్ API పనిచేసే వరకు అంచనా నిలిపివేయబడింది.",
            dbUnavailable: "డేటాబేస్ విలువలు అందుబాటులో లేవు", dbInputFailure: "డేటాబేస్ ఇన్‌పుట్‌లను లోడ్ చేయలేకపోయాం: {message}",
            cannotConnectApi: "APIకి కనెక్ట్ కాలేకపోయాం. FastAPI నడుస్తోందో, CORSలో frontend చిరునామా అనుమతించబడిందో తనిఖీ చేయండి.",
            notAvailable: "అందుబాటులో లేదు", temperatureAnomalyEstimate: "ఉష్ణోగ్రత వ్యత్యాస అంచనా",
            predictionTargetWithSeason: "{target}. డేటాబేస్ ఆధారంగా లక్ష్య సీజన్: {season}. ఇది అంచనా వేసిన వ్యత్యాసం మాత్రమే; సంపూర్ణ గాలి ఉష్ణోగ్రత కాదు.",
            predictionTargetNoSeason: "{target}. ఇది అంచనా వేసిన వ్యత్యాసం మాత్రమే; సంపూర్ణ గాలి ఉష్ణోగ్రత కాదు.",
            experimentalDisclaimer: "ఇది ప్రయోగాత్మక అంచనా. అధికారిక వాతావరణ సూచనగా ఉపయోగించవద్దు.",
            predictionDisabled: "నిజమైన డేటాబేస్ ఇన్‌పుట్‌లు విజయవంతంగా లోడ్ అయ్యే వరకు అంచనా నిలిపివేయబడుతుంది.",
            buttonCalculating: "అంచనా లెక్కిస్తోంది...", predictionRequestFailed: "అంచనా అభ్యర్థన విఫలమైంది.",
            invalidPrediction: "API స్పందనలో సరైన ఉష్ణోగ్రత అంచనా లేదు.",
            predictionSuccess: "ఫారమ్‌లో ప్రస్తుతం ఉన్న విలువలతో FastAPI backend నుంచి అంచనా విజయవంతంగా అందింది.",
            cannotConnectPrediction: "Prediction APIకి కనెక్ట్ కాలేకపోయాం. FastAPI మరియు CORS సెట్టింగ్‌లను తనిఖీ చేయండి.",
            pleaseEnterNumber: "దయచేసి {field} కోసం సరైన సంఖ్యను నమోదు చేయండి.", buttonReloadDb: "డేటాబేస్ విలువలను మళ్లీ లోడ్ చేస్తోంది...",
            reloadingDbMessage: "తాజా డేటాబేస్ విలువలను మళ్లీ లోడ్ చేస్తోంది..."
        }
    };

    let language = "en";
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        language = saved === "te" ? "te" : "en";
    } catch (_) {
        language = "en";
    }

    function t(key, params = {}) {
        const template = (dictionaries[language] && dictionaries[language][key]) || dictionaries.en[key] || key;
        return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) =>
            params[name] === undefined || params[name] === null ? "" : String(params[name])
        );
    }

    function setText(elementOrId, key, params = {}) {
        const element = typeof elementOrId === "string"
            ? document.getElementById(elementOrId)
            : elementOrId;
        if (!element) return;
        element.dataset.i18nDynamic = key;
        element.dataset.i18nParams = JSON.stringify(params);
        element.textContent = t(key, params);
    }

    function refreshPageText() {
        document.documentElement.lang = language === "te" ? "te" : "en";
        document.title = t("documentTitle");
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            element.textContent = t(key);
        });
        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
        });
        document.querySelectorAll("[data-i18n-dynamic]").forEach((element) => {
            let params = {};
            try { params = JSON.parse(element.dataset.i18nParams || "{}"); } catch (_) {}
            element.textContent = t(element.dataset.i18nDynamic, params);
        });
        const select = document.getElementById("predictionLanguage");
        if (select) select.value = language;
        window.dispatchEvent(new CustomEvent("impact-prediction:languagechange", { detail: { language } }));
    }

    function setLanguage(nextLanguage) {
        language = nextLanguage === "te" ? "te" : "en";
        try { localStorage.setItem(STORAGE_KEY, language); } catch (_) {}
        refreshPageText();
    }

    window.ImpactPredictionI18n = { t, setText, setLanguage, getLanguage: () => language, refresh: refreshPageText };

    document.addEventListener("DOMContentLoaded", () => {
        const select = document.getElementById("predictionLanguage");
        if (select) {
            select.value = language;
            select.addEventListener("change", () => setLanguage(select.value));
        }
        refreshPageText();
    });
})();

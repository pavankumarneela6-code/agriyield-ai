(() => {
    "use strict";

    const API_BASE_URL = "http://127.0.0.1:8000";

    const state = {
        records: [],
        charts: {}
    };

    const translations = {
        en: {
            backDashboard: "← Dashboard",
            pageEyebrow: "HISTORICAL CLIMATE DATA",
            pageHeading: "Historical Weather Analysis",
            pageDescription:
                "Explore actual historical weather records retrieved from Open-Meteo and stored in PostgreSQL.",
            sourceBadge: "● Real historical data",
            locationLabel: "Saved location",
            startDateLabel: "Start date",
            endDateLabel: "End date",
            loadDataButton: "Load Data",
            readyMessage: "Select a saved location and date range to view historical data.",
            metricRecords: "Records Returned",
            metricAverageTemp: "Average Temperature",
            metricMaxTemp: "Maximum Temperature",
            metricMinTemp: "Minimum Temperature",
            metricTotalPrecip: "Total Precipitation",
            chartTempTitle: "Daily Average Temperature",
            chartPrecipTitle: "Daily Precipitation",
            chartHumidityTitle: "Daily Average Humidity",
            chartWindTitle: "Daily Maximum Wind Speed",
            annualPrecipTitle: "Annual Precipitation Trend",
            yearlySummaryLoading: "Loading yearly summary...",
            yearlySummaryNoRecords: "No yearly summary records found.",
            yearlySummaryLoaded: "Loaded {count} annual summaries from PostgreSQL.",
            yearlySummaryError: "Unable to load yearly climate summary.",
            yearLabel: "Year",
            sourceNote:
                "Source: Open-Meteo Historical Weather API. These values are historical reanalysis data, not necessarily direct weather-station measurements.",
            loadingLocations: "Loading your saved locations...",
            loadingData: "Loading historical weather data...",
            loginRequired: "Please log in through the El Niño AI website first.",
            noLocations: "No saved locations found for this account.",
            locationError: "Unable to load saved locations. Check the backend and login status.",
            dateError: "Please select a valid start date and end date.",
            noRecords: "No historical records found for this location and date range.",
            recordsLoaded: "Loaded {count} historical records from PostgreSQL.",
            dataError: "Unable to load historical weather data.",
            temperatureLabel: "Temperature",
            annualTempTitle: "Yearly Average Temperature Trend",
            precipitationLabel: "Precipitation",
            humidityLabel: "Humidity",
            windLabel: "Wind speed",
            annualHumidityTitle: "Yearly Average Humidity Trend",
            annualWindTitle: "Yearly Average Daily Maximum Wind Speed",
            chartDateLabel: "Date",
            recordsUnit: "Daily observations",
            emptyOption: "Choose a location"
        },

        te: {
            backDashboard: "← డాష్‌బోర్డ్",
            pageEyebrow: "చారిత్రక వాతావరణ డేటా",
            pageHeading: "చారిత్రక వాతావరణ విశ్లేషణ",
            pageDescription:
                "Open-Meteo నుంచి తీసుకొని PostgreSQL‌లో భద్రపరిచిన వాస్తవ చారిత్రక వాతావరణ రికార్డులను చూడండి.",
            sourceBadge: "● నిజమైన చారిత్రక డేటా",
            locationLabel: "సేవ్ చేసిన ప్రాంతం",
            startDateLabel: "ప్రారంభ తేదీ",
            endDateLabel: "ముగింపు తేదీ",
            loadDataButton: "డేటా లోడ్ చేయి",
            readyMessage: "చారిత్రక డేటా చూడటానికి ప్రాంతం, తేదీలను ఎంచుకోండి.",
            metricRecords: "రికార్డుల సంఖ్య",
            metricAverageTemp: "సగటు ఉష్ణోగ్రత",
            metricMaxTemp: "గరిష్ఠ ఉష్ణోగ్రత",
            metricMinTemp: "కనిష్ఠ ఉష్ణోగ్రత",
            metricTotalPrecip: "మొత్తం అవపాతం",
            chartTempTitle: "రోజువారీ సగటు ఉష్ణోగ్రత",
            chartPrecipTitle: "రోజువారీ అవపాతం",
            chartHumidityTitle: "రోజువారీ సగటు తేమ",
            chartWindTitle: "రోజువారీ గరిష్ఠ గాలి వేగం",
            annualPrecipTitle: "సంవత్సరాల వారీ అవపాత ధోరణి",
            yearlySummaryLoading: "సంవత్సరాల వారీ డేటాను లోడ్ చేస్తున్నాం...",
            yearlySummaryNoRecords: "సంవత్సరాల వారీ రికార్డులు లభించలేదు.",
            yearlySummaryLoaded: "PostgreSQL నుంచి {count} సంవత్సరాల సారాంశాలు లోడ్ అయ్యాయి.",
            yearlySummaryError: "సంవత్సరాల వాతావరణ డేటాను లోడ్ చేయలేకపోయాం.",
            yearLabel: "సంవత్సరం",
            sourceNote:
                "మూలం: Open-Meteo Historical Weather API. ఇవి చారిత్రక రీఅనాలిసిస్ డేటా విలువలు; నేరుగా వాతావరణ స్టేషన్ కొలతలు అని భావించకూడదు.",
            loadingLocations: "సేవ్ చేసిన ప్రాంతాలను లోడ్ చేస్తున్నాం...",
            loadingData: "చారిత్రక వాతావరణ డేటాను లోడ్ చేస్తున్నాం...",
            loginRequired: "ముందుగా El Niño AI వెబ్‌సైట్‌లో లాగిన్ అవ్వండి.",
            noLocations: "ఈ ఖాతాకు సేవ్ చేసిన ప్రాంతాలు లేవు.",
            locationError: "ప్రాంతాలను లోడ్ చేయలేకపోయాం. బ్యాకెండ్, లాగిన్‌ను తనిఖీ చేయండి.",
            dateError: "సరైన ప్రారంభ, ముగింపు తేదీలను ఎంచుకోండి.",
            noRecords: "ఈ ప్రాంతం, తేదీలకు చారిత్రక రికార్డులు లేవు.",
            recordsLoaded: "PostgreSQL నుంచి {count} చారిత్రక రికార్డులు లోడ్ అయ్యాయి.",
            dataError: "చారిత్రక వాతావరణ డేటాను లోడ్ చేయలేకపోయాం.",
            temperatureLabel: "ఉష్ణోగ్రత",
            annualTempTitle: "సంవత్సరాల వారీ సగటు ఉష్ణోగ్రత ధోరణి",
            precipitationLabel: "అవపాతం",
            humidityLabel: "తేమ",
            windLabel: "గాలి వేగం",
            chartDateLabel: "తేదీ",
            annualHumidityTitle: "సంవత్సరాల వారీ సగటు తేమ ధోరణి",
            annualWindTitle: "సంవత్సరాల వారీ గరిష్ఠ రోజువారీ గాలి వేగం",
            recordsUnit: "రోజువారీ పరిశీలనలు",
            emptyOption: "ప్రాంతాన్ని ఎంచుకోండి"
        },

        hi: {
            backDashboard: "← डैशबोर्ड",
            pageEyebrow: "ऐतिहासिक जलवायु डेटा",
            pageHeading: "ऐतिहासिक मौसम विश्लेषण",
            pageDescription:
                "Open-Meteo से प्राप्त और PostgreSQL में संग्रहीत वास्तविक ऐतिहासिक मौसम रिकॉर्ड देखें।",
            sourceBadge: "● वास्तविक ऐतिहासिक डेटा",
            locationLabel: "सहेजा गया स्थान",
            startDateLabel: "आरंभ तिथि",
            endDateLabel: "अंतिम तिथि",
            loadDataButton: "डेटा लोड करें",
            readyMessage: "ऐतिहासिक डेटा देखने के लिए स्थान और तारीखें चुनें।",
            metricRecords: "प्राप्त रिकॉर्ड",
            metricAverageTemp: "औसत तापमान",
            metricMaxTemp: "अधिकतम तापमान",
            metricMinTemp: "न्यूनतम तापमान",
            metricTotalPrecip: "कुल वर्षा",
            chartTempTitle: "दैनिक औसत तापमान",
            chartPrecipTitle: "दैनिक वर्षा",
            chartHumidityTitle: "दैनिक औसत आर्द्रता",
            chartWindTitle: "दैनिक अधिकतम हवा की गति",
            annualPrecipTitle: "वार्षिक वर्षा प्रवृत्ति",
            yearlySummaryLoading: "वार्षिक डेटा लोड हो रहा है...",
            yearlySummaryNoRecords: "वार्षिक रिकॉर्ड नहीं मिले।",
            yearlySummaryLoaded: "PostgreSQL से {count} वार्षिक सारांश लोड हुए।",
            yearlySummaryError: "वार्षिक जलवायु डेटा लोड नहीं हो सका।",
            yearLabel: "वर्ष",
            sourceNote:
                "स्रोत: Open-Meteo Historical Weather API. ये ऐतिहासिक रीएनालिसिस डेटा मान हैं; इन्हें सीधे मौसम-स्टेशन माप नहीं माना जाना चाहिए।",
            loadingLocations: "सहेजे गए स्थान लोड हो रहे हैं...",
            loadingData: "ऐतिहासिक मौसम डेटा लोड हो रहा है...",
            loginRequired: "कृपया पहले El Niño AI वेबसाइट पर लॉग इन करें।",
            noLocations: "इस खाते के लिए कोई सहेजा गया स्थान नहीं मिला।",
            locationError: "स्थान लोड नहीं हो सके। बैकएंड और लॉगिन जाँचें।",
            dateError: "कृपया सही आरंभ और अंतिम तारीख चुनें।",
            noRecords: "इस स्थान और तारीख सीमा के लिए ऐतिहासिक रिकॉर्ड नहीं मिले।",
            recordsLoaded: "PostgreSQL से {count} ऐतिहासिक रिकॉर्ड लोड हुए।",
            dataError: "ऐतिहासिक मौसम डेटा लोड नहीं हो सका।",
            annualTempTitle: "वार्षिक औसत तापमान प्रवृत्ति",
            annualHumidityTitle: "वार्षिक औसत आर्द्रता प्रवृत्ति",
            annualWindTitle: "वार्षिक औसत दैनिक अधिकतम हवा की गति",
            temperatureLabel: "तापमान",
            precipitationLabel: "वर्षा",
            humidityLabel: "आर्द्रता",
            windLabel: "हवा की गति",
            chartDateLabel: "तारीख",
            recordsUnit: "दैनिक अवलोकन",
            emptyOption: "स्थान चुनें"
        }
    };

    const $ = (id) => document.getElementById(id);

    function getLanguage() {
        const globalLanguage =
            window.ElNinoLanguage?.getLanguage?.();

        const savedLanguage =
            localStorage.getItem("elninoLanguage");

        const selectedLanguage =
            $("languageSelect")?.value;

        const language =
            selectedLanguage || globalLanguage || savedLanguage || "en";

        return translations[language] ? language : "en";
    }

    function t(key) {
        const language = getLanguage();

        return translations[language][key]
            || translations.en[key]
            || key;
    }

    function applyPageTranslations() {
        document.querySelectorAll("[data-page-i18n]").forEach((element) => {
            const key = element.dataset.pageI18n;
            const translatedText = t(key);

            if (translatedText) {
                element.textContent = translatedText;
            }
        });

        document.documentElement.lang = getLanguage();

        document.title = t("pageHeading") + " | El Niño AI";

        if (state.records.length > 0) {
            renderCharts(state.records);

            const locationId = $("historyLocation")?.value;
            const startDate = $("historyStartDate")?.value;
            const endDate = $("historyEndDate")?.value;
            console.log("Selected Location:", locationId);
            console.log("Start Date:", startDate);
            console.log("End Date:", endDate);

            if (
                locationId &&
                startDate &&
                endDate &&
                startDate <= endDate
            ) {
                void loadYearlySummary(
                    locationId,
                    Number(startDate.slice(0, 4)),
                    Number(endDate.slice(0, 4))
                );
            }
        }
    }

    function getAccessToken() {
        return (
            sessionStorage.getItem("elninoAccessToken")
            || localStorage.getItem("elninoAccessToken")
            || sessionStorage.getItem("access_token")
            || localStorage.getItem("access_token")
        );
    }

    function authHeaders() {
        const token = getAccessToken();

        if (!token) {
            throw new Error(t("loginRequired"));
        }

        return {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        };
    }

    async function readJsonResponse(response) {
        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(t("loginRequired"));
            }

            throw new Error(
                typeof data.detail === "string"
                    ? data.detail
                    : `HTTP ${response.status}`
            );
        }

        return data;
    }

    function showMessage(message, type = "info") {
        const element = $("historyMessage");

        element.textContent = message;
        element.className = `history-message ${type}`;
    }

    function destroyCharts() {
        Object.values(state.charts).forEach((chart) => {
            if (chart) {
                chart.destroy();
            }
        });

        state.charts = {};
    }

    function setMetric(id, value) {
        $(id).textContent = value;
    }

    function resetMetrics() {
        setMetric("recordsCount", "0");
        setMetric("averageTemperature", "—");
        setMetric("maximumTemperature", "—");
        setMetric("minimumTemperature", "—");
        setMetric("totalPrecipitation", "—");
    }

    function numericValues(records, key) {
        return records
            .map((record) => record[key])
            .filter((value) => (
                typeof value === "number" && Number.isFinite(value)
            ));
    }

    function formatNumber(value) {
        return Number(value).toFixed(1);
    }

    function updateMetrics(records) {
        setMetric("recordsCount", String(records.length));

        const temperatures = numericValues(records, "temperature_c");
        const precipitation = numericValues(records, "precipitation_mm");

        if (temperatures.length > 0) {
            const average =
                temperatures.reduce((sum, value) => sum + value, 0)
                / temperatures.length;

            setMetric("averageTemperature", formatNumber(average));
            setMetric("maximumTemperature", formatNumber(
                Math.max(...temperatures)
            ));
            setMetric("minimumTemperature", formatNumber(
                Math.min(...temperatures)
            ));
        } else {
            setMetric("averageTemperature", "—");
            setMetric("maximumTemperature", "—");
            setMetric("minimumTemperature", "—");
        }

        if (precipitation.length > 0) {
            const total = precipitation.reduce(
                (sum, value) => sum + value,
                0
            );

            setMetric("totalPrecipitation", formatNumber(total));
        } else {
            setMetric("totalPrecipitation", "—");
        }
    }

    function formatChartDate(dateString) {
        const [year, month, day] = dateString.split("-").map(Number);

        const date = new Date(year, month - 1, day);

        return date.toLocaleDateString(getLanguage(), {
            month: "short",
            day: "numeric"
        });
    }

    function createChart(canvasId, type, label, values, unit, color) {
        const canvas = $(canvasId);

        const chart = new Chart(canvas, {
            type,

            data: {
                labels: state.records.map((record) =>
                    formatChartDate(record.date)
                ),

                datasets: [{
                    label,
                    data: values,
                    borderColor: color,
                    backgroundColor:
                        type === "bar" ? color : `${color}33`,
                    borderWidth: 2,
                    fill: type === "line",
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    spanGaps: false
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                interaction: {
                    intersect: false,
                    mode: "index"
                },

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: {
                        callbacks: {
                            label(context) {
                                const value = context.parsed.y;

                                if (value === null || value === undefined) {
                                    return `${label}: —`;
                                }

                                return `${label}: ${value} ${unit}`;
                            }
                        }
                    }
                },

                scales: {
                    x: {
                        title: {
                            display: true,
                            text: t("chartDateLabel"),
                            color: "#9fb0c5"
                        },

                        ticks: {
                            color: "#9fb0c5"
                        },

                        grid: {
                            display: false
                        }
                    },

                    y: {
                        beginAtZero: type === "bar",

                        ticks: {
                            color: "#9fb0c5"
                        },

                        grid: {
                            color: "rgba(159, 176, 197, 0.12)"
                        }
                    }
                }
            }
        });

        return chart;
    }

    function renderCharts(records) {
        if (typeof Chart === "undefined") {
            showMessage(
                "Chart.js did not load. Check your internet connection.",
                "error"
            );
            return;
        }

        destroyCharts();

        // Use only values returned by the historical API.
        state.charts.temperature = createChart(
            "temperatureChart",
            "line",
            t("temperatureLabel"),
            records.map((record) => record.temperature_c),
            "°C",
            "#25d9b0"
        );

        state.charts.precipitation = createChart(
            "precipitationChart",
            "bar",
            t("precipitationLabel"),
            records.map((record) => record.precipitation_mm),
            "mm",
            "#38bdf8"
        );

        state.charts.humidity = createChart(
            "humidityChart",
            "line",
            t("humidityLabel"),
            records.map((record) => record.humidity_percent),
            "%",
            "#a78bfa"
        );

        state.charts.wind = createChart(
            "windChart",
            "line",
            t("windLabel"),
            records.map((record) => record.wind_speed_kmh),
            "km/h",
            "#fbbf24"
        );
    }
async function loadYearlySummary(locationId, startYear, endYear) {
    const message = $("yearlySummaryMessage");

    const canvases = {
        yearlyPrecipitation: $("yearlyPrecipitationChart"),
        yearlyTemperature: $("yearlyTemperatureChart"),
        yearlyHumidity: $("yearlyHumidityChart"),
        yearlyWind: $("yearlyWindChart")
    };

    if (
        !message ||
        Object.values(canvases).some(canvas => !canvas)
    ) {
        console.error("Yearly climate chart elements are missing.");
        return;
    }

    // Destroy old annual charts before creating new ones.
    Object.keys(canvases).forEach(key => {
        if (state.charts[key]) {
            state.charts[key].destroy();
            delete state.charts[key];
        }
    });

    message.textContent = t("yearlySummaryLoading");

    try {
        const query = new URLSearchParams({
            start_year: String(startYear),
            end_year: String(endYear)
        });

        const url =
            `${API_BASE_URL}/api/locations/` +
            `${encodeURIComponent(locationId)}/yearly-summary?${query}`;

        // Fetch real annual summaries from PostgreSQL through FastAPI.
        const response = await fetch(url, {
            method: "GET",
            headers: authHeaders()
        });

        const data = await readJsonResponse(response);

        const records = Array.isArray(data.records)
            ? data.records
            : [];

        if (records.length === 0) {
            message.textContent = t("yearlySummaryNoRecords");
            return;
        }

        const labels = records.map(record => String(record.year));

        const chartDefinitions = [
            {
                key: "yearlyPrecipitation",
                canvas: canvases.yearlyPrecipitation,
                type: "bar",
                label: t("precipitationLabel"),
                field: "total_precipitation_mm",
                unit: "mm",
                color: "#38bdf8",
                beginAtZero: true
            },
            {
                key: "yearlyTemperature",
                canvas: canvases.yearlyTemperature,
                type: "line",
                label: t("temperatureLabel"),
                field: "average_temperature_c",
                unit: "°C",
                color: "#25d9b0",
                beginAtZero: false
            },
            {
                key: "yearlyHumidity",
                canvas: canvases.yearlyHumidity,
                type: "line",
                label: t("humidityLabel"),
                field: "average_humidity_percent",
                unit: "%",
                color: "#a78bfa",
                beginAtZero: true,
                max: 100
            },
            {
                key: "yearlyWind",
                canvas: canvases.yearlyWind,
                type: "line",
                label: t("windLabel"),
                field: "average_daily_max_wind_kmh",
                unit: "km/h",
                color: "#fbbf24",
                beginAtZero: true
            }
        ];

        for (const definition of chartDefinitions) {
            const values = records.map(record => {
                const value = record[definition.field];

                return (
                    typeof value === "number" &&
                    Number.isFinite(value)
                ) ? value : null;
            });

            state.charts[definition.key] = new Chart(
                definition.canvas,
                {
                    type: definition.type,

                    data: {
                        labels,

                        datasets: [{
                            label: definition.label,
                            data: values,
                            borderColor: definition.color,
                            backgroundColor:
                                definition.type === "bar"
                                    ? definition.color
                                    : `${definition.color}25`,
                            borderWidth: 2,
                            borderRadius:
                                definition.type === "bar" ? 6 : 0,
                            fill: definition.type === "line",
                            tension: 0.25,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            spanGaps: false
                        }]
                    },

                    options: {
                        responsive: true,
                        maintainAspectRatio: false,

                        interaction: {
                            intersect: false,
                            mode: "index"
                        },

                        plugins: {
                            legend: {
                                display: false
                            },

                            tooltip: {
                                callbacks: {
                                    label(context) {
                                        const value = context.parsed.y;

                                        if (
                                            value === null ||
                                            value === undefined
                                        ) {
                                            return `${definition.label}: —`;
                                        }

                                        return (
                                            `${definition.label}: ` +
                                            `${value} ${definition.unit}`
                                        );
                                    }
                                }
                            }
                        },

                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: t("yearLabel"),
                                    color: "#9fb0c5"
                                },

                                ticks: {
                                    color: "#9fb0c5"
                                },

                                grid: {
                                    display: false
                                }
                            },

                            y: {
                                beginAtZero: definition.beginAtZero,

                                ...(definition.max !== undefined
                                    ? { max: definition.max }
                                    : {}),

                                title: {
                                    display: true,
                                    text:
                                        `${definition.label} ` +
                                        `(${definition.unit})`,
                                    color: "#9fb0c5"
                                },

                                ticks: {
                                    color: "#9fb0c5"
                                },

                                grid: {
                                    color:
                                        "rgba(159, 176, 197, 0.12)"
                                }
                            }
                        }
                    }
                }
            );
        }

        message.textContent = t("yearlySummaryLoaded").replace(
            "{count}",
            String(records.length)
        );

    } catch (error) {
        console.error("Yearly climate summary failed:", error);

        message.textContent =
            `${t("yearlySummaryError")} ${error.message}`;
    }
}
    console.log("Historical Data JS Loaded");
    async function loadLocations() {
        console.log("Loading locations...");
        const locationSelect = $("historyLocation");

        locationSelect.innerHTML = "";

        const loadingOption = document.createElement("option");
        loadingOption.value = "";
        loadingOption.textContent = t("loadingLocations");

        locationSelect.appendChild(loadingOption);
        
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/locations/`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );
            

            const data = await readJsonResponse(response);
            const locations = data.locations || [];
            console.log("Locations API Response:", locations);

            locationSelect.innerHTML = "";

            if (locations.length === 0) {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = t("noLocations");

                locationSelect.appendChild(option);

                showMessage(t("noLocations"), "error");
                resetMetrics();
                destroyCharts();
                return;
            }

            locations.forEach((location) => {
                const option = document.createElement("option");

                option.value = String(location.location_id);

                const parts = [
                    location.location_name,
                    location.state,
                    location.country,
                    `ID ${location.location_id}`
                ].filter(Boolean);

                option.textContent = parts.join(", ");
                locationSelect.appendChild(option);
            });

            // Select the user's currently active default location.
            // If no default location exists, use the first saved location.
            const defaultLocation = locations.find(
                (location) => location.is_default === true
            );

            const selectedLocation = defaultLocation || locations[0];

            locationSelect.value = String(selectedLocation.location_id);

            // Automatically load historical data for the selected city.
            await loadHistoricalData();

        } catch (error) {
            console.error("Unable to load saved locations:", error);

            locationSelect.innerHTML = "";

            const option = document.createElement("option");
            option.value = "";
            option.textContent = t("locationError");

            locationSelect.appendChild(option);

            showMessage(
                error.message === t("loginRequired")
                    ? t("loginRequired")
                    : t("locationError"),
                "error"
            );
        }
    }

    async function loadHistoricalData() {
        const locationId = $("historyLocation").value;
        const startDate = $("historyStartDate").value;
        const endDate = $("historyEndDate").value;
        const button = $("loadHistoryButton");

        if (!locationId) {
            showMessage(t("noLocations"), "error");
            return;
        }

        if (!startDate || !endDate || startDate > endDate) {
            showMessage(t("dateError"), "error");
            return;
        }

        button.disabled = true;
        button.textContent = t("loadingData");

        showMessage(t("loadingData"));

        try {
            const query = new URLSearchParams({
                start_date: startDate,
                end_date: endDate
            });

            const url =
                `${API_BASE_URL}/api/locations/`
                + `${encodeURIComponent(locationId)}/historical-weather?${query}`;

            console.log("Historical API URL:", url);
            const response = await fetch(url, {
                method: "GET",
                headers: authHeaders()
            });

            const data = await readJsonResponse(response);

            state.records = Array.isArray(data.records)
                ? data.records
                : [];

            updateMetrics(state.records);

            if (state.records.length === 0) {
                destroyCharts();

                showMessage(t("noRecords"), "info");
                return;
            }

            renderCharts(state.records);
            await loadYearlySummary(
                locationId,
                Number(startDate.slice(0, 4)),
                Number(endDate.slice(0, 4))
            );
            showMessage(
                t("recordsLoaded").replace(
                    "{count}",
                    String(state.records.length)
                ),
                "success"
            );

        } catch (error) {
            console.error("Historical weather request failed:", error);

            state.records = [];
            resetMetrics();
            destroyCharts();

            showMessage(
                error.message === t("loginRequired")
                    ? t("loginRequired")
                    : `${t("dataError")} ${error.message}`,
                "error"
            );

        } finally {
            button.disabled = false;
            button.textContent = t("loadDataButton");
        }
    }

    document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // SET DEFAULT DATE RANGE
    // =========================================

    const startDateInput = $("historyStartDate");
    const endDateInput = $("historyEndDate");

    function formatLocalDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const today = new Date();

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    if (startDateInput && !startDateInput.value) {
        startDateInput.value = formatLocalDate(oneYearAgo);
    }

    if (endDateInput && !endDateInput.value) {
        endDateInput.value = formatLocalDate(today);
    }

    // =========================================
    // HISTORICAL FILTER FORM
    // =========================================

    $("historicalFilterForm").addEventListener(
        "submit",
        (event) => {
            event.preventDefault();
            loadHistoricalData();
        }
    );

    // =========================================
    // LANGUAGE CHANGE
    // =========================================

    const languageSelect = $("languageSelect");

    if (languageSelect) {
        languageSelect.addEventListener(
            "change",
            () => {
                setTimeout(applyPageTranslations, 0);
            }
        );
    }

    window.addEventListener(
        "elnino:languagechange",
        applyPageTranslations
    );

    applyPageTranslations();

    // Automatically load selected location's history.
    loadLocations();
});

})();
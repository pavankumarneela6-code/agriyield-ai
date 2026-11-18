"use strict";

// =====================================================
// GLOBAL DASHBOARD WEATHER CARD UPDATER
// =====================================================

window.updateDashboardWeatherCards = function (weather) {

    if (!weather || typeof weather !== "object") {
        console.warn("Weather data unavailable.");
        return;
    }

    const weatherFields = {
        temperatureValue: { value: weather.temperature, digits: 1 },
        rainfallValue: { value: weather.precipitation, digits: 1 },
        feelsLikeValue: { value: weather.feels_like, digits: 1 },
        humidityValue: { value: weather.humidity, digits: 0 },
        windSpeedValue: { value: weather.wind_speed, digits: 1 },
        windDirectionValue: { value: weather.wind_direction, digits: 0 },
        windGustsValue: { value: weather.wind_gusts, digits: 1 },
        pressureValue: { value: weather.pressure, digits: 1 },
        cloudCoverValue: { value: weather.cloud_cover, digits: 0 },
        uvIndexValue: { value: weather.uv_index, digits: 1 }
    };

    Object.entries(weatherFields).forEach(([id, field]) => {

        const element = document.getElementById(id);

        if (!element) return;

        const value = field.value;

        element.textContent =
            typeof value === "number" && Number.isFinite(value)
                ? value.toFixed(field.digits)
                : "—";
    });

    const sourceElement =
        document.getElementById("weatherSourceValue");

    const sourceTypeElement =
        document.getElementById("weatherSourceTypeValue");

    const updatedElement =
        document.getElementById("weatherUpdatedAtValue");

    if (sourceElement) {
        sourceElement.textContent = weather.source || "—";
    }

    if (sourceTypeElement) {
        sourceTypeElement.textContent = weather.source_type || "—";
    }

    if (updatedElement) {
        updatedElement.textContent = weather.updated_at || "—";
    }
};


// =====================================================
// DASHBOARD DYNAMIC TRANSLATION SYSTEM
// =====================================================

function getDashboardLanguage() {

    return localStorage.getItem("elninoLanguage") || "en";

}


function dashboardTranslate(key) {

    const translations = {

        en: {
            loading: "Loading...",
            unavailable: "Unavailable",
            notAvailable: "Data unavailable",
            regionalAssessment: "Historical climate assessment",
            analyzingClimate: "Analyzing historical climate data...",
            rainfallDeficit: "Rainfall deficit",
            temperatureAnomaly: "Temperature anomaly",
            high: "High",
            moderate: "Moderate",
            low: "Low",
            severe: "Severe",
            normal: "Normal",
            roniDescription: "Latest climate index observation",
            noEpisode: "No sustained episode confirmed",
            elNino: "El Niño",
            laNina: "La Niña",
            neutral: "Neutral",
            retrieved: "Retrieved",
            connectingNOAA: "Connecting to NOAA...",
            waitingNOAA: "Waiting for NOAA data",
            noData: "Unable to retrieve NOAA data",
            noHistoricalData: "Insufficient historical climate data.",
            unableRegional: "Unable to retrieve regional climate data.",
            episodeStatus: "Data unavailable"
        },

        te: {
            loading: "లోడ్ అవుతోంది...",
            unavailable: "అందుబాటులో లేదు",
            notAvailable: "డేటా అందుబాటులో లేదు",
            regionalAssessment: "చారిత్రక వాతావరణ అంచనా",
            analyzingClimate: "చారిత్రక వాతావరణ డేటాను విశ్లేషిస్తోంది...",
            rainfallDeficit: "వర్షపాతం లోటు",
            temperatureAnomaly: "ఉష్ణోగ్రత వ్యత్యాసం",
            high: "అధికం",
            moderate: "మధ్యస్థం",
            low: "తక్కువ",
            severe: "తీవ్రమైన",
            normal: "సాధారణం",
            roniDescription: "తాజా వాతావరణ సూచిక పరిశీలన",
            noEpisode: "కొనసాగుతున్న ఎపిసోడ్ ఇంకా నిర్ధారించబడలేదు",
            elNino: "ఎల్ నినో",
            laNina: "లా నినా",
            neutral: "తటస్థం",
            retrieved: "పొందిన సమయం",
            connectingNOAA: "NOAA కు కనెక్ట్ అవుతోంది...",
            waitingNOAA: "NOAA డేటా కోసం వేచి ఉంది",
            noData: "NOAA డేటాను పొందలేకపోయాము",
            noHistoricalData: "తగినంత చారిత్రక వాతావరణ డేటా లేదు.",
            unableRegional: "ప్రాంతీయ వాతావరణ డేటాను పొందలేకపోయాము.",
            episodeStatus: "డేటా అందుబాటులో లేదు"
        },

        hi: {
            loading: "लोड हो रहा है...",
            unavailable: "उपलब्ध नहीं",
            notAvailable: "डेटा उपलब्ध नहीं है",
            regionalAssessment: "ऐतिहासिक जलवायु आकलन",
            analyzingClimate: "ऐतिहासिक जलवायु डेटा का विश्लेषण हो रहा है...",
            rainfallDeficit: "वर्षा की कमी",
            temperatureAnomaly: "तापमान विसंगति",
            high: "उच्च",
            moderate: "मध्यम",
            low: "कम",
            severe: "गंभीर",
            normal: "सामान्य",
            roniDescription: "नवीनतम जलवायु सूचकांक अवलोकन",
            noEpisode: "लगातार एपिसोड की पुष्टि नहीं हुई है",
            elNino: "अल नीनो",
            laNina: "ला नीना",
            neutral: "तटस्थ",
            retrieved: "प्राप्त समय",
            connectingNOAA: "NOAA से कनेक्ट हो रहा है...",
            waitingNOAA: "NOAA डेटा की प्रतीक्षा है",
            noData: "NOAA डेटा प्राप्त नहीं किया जा सका",
            noHistoricalData: "पर्याप्त ऐतिहासिक जलवायु डेटा उपलब्ध नहीं है।",
            unableRegional: "क्षेत्रीय जलवायु डेटा प्राप्त नहीं किया जा सका।",
            episodeStatus: "डेटा उपलब्ध नहीं है"
        }

    };

    const language = getDashboardLanguage();

    const dictionary =
        translations[language] || translations.en;

    return dictionary[key] || translations.en[key] || key;
}


function translateClimateCondition(value) {

    if (!value) {
        return dashboardTranslate("unavailable");
    }

    const normalized = String(value).toLowerCase().trim();

    const supported = [
        "high",
        "moderate",
        "low",
        "severe",
        "normal",
        "unavailable"
    ];

    return supported.includes(normalized)
        ? dashboardTranslate(normalized)
        : String(value);
}


function translateENSOCondition(value) {

    if (!value) {
        return dashboardTranslate("unavailable");
    }

    const normalized = String(value).toLowerCase().trim();

    if (
        normalized.includes("el niño") ||
        normalized.includes("el nino")
    ) {
        return dashboardTranslate("elNino");
    }

    if (
        normalized.includes("la niña") ||
        normalized.includes("la nina")
    ) {
        return dashboardTranslate("laNina");
    }

    if (normalized.includes("neutral")) {
        return dashboardTranslate("neutral");
    }

    return value;
}


// =====================================================
// EL NINO AI - DASHBOARD SYSTEM
// =====================================================

document.addEventListener("DOMContentLoaded", async function () {

    const API_BASE_URL = "http://127.0.0.1:8000";

    // =================================================
    // 01. API MONITORING
    // =================================================

    const apiIndicator =
        document.querySelector(".system-indicator");

    async function checkAPIStatus() {

        if (!apiIndicator) return;

        apiIndicator.textContent = "Checking API...";

        try {

            const response = await fetch(
                `${API_BASE_URL}/health`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json"
                    },
                    signal: AbortSignal.timeout(5000)
                }
            );

            if (!response.ok) {
                throw new Error("Backend health check failed");
            }

            apiIndicator.replaceChildren();

            const dot = document.createElement("span");
            dot.className = "indicator-dot";

            apiIndicator.append(dot, " API connected");
            apiIndicator.dataset.status = "connected";

        } catch (error) {

            apiIndicator.replaceChildren();

            const dot = document.createElement("span");
            dot.className = "indicator-dot muted-dot";

            apiIndicator.append(dot, " API unavailable");
            apiIndicator.dataset.status = "disconnected";

            console.error("API status check failed:", error);
        }
    }

    await checkAPIStatus();


    // =================================================
    // 02. DASHBOARD ELEMENTS
    // =================================================

    const sidebar =
        document.getElementById("dashboardSidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");

    const logoutButton =
        document.getElementById("logoutButton");

    const userNameElement =
        document.getElementById("dashboardUserName");

    const userEmailElement =
        document.getElementById("dashboardUserEmail");

    const avatarElement =
        document.getElementById("profileAvatar");


    // =================================================
    // 03. RESPONSIVE SIDEBAR
    // =================================================

    if (sidebar && sidebarToggle) {

        sidebarToggle.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (window.innerWidth <= 950) {
                sidebar.classList.toggle("sidebar-open");
            } else {
                sidebar.classList.toggle("sidebar-collapsed");
            }
        });

        document.addEventListener("click", function (event) {

            if (
                window.innerWidth <= 950 &&
                sidebar.classList.contains("sidebar-open") &&
                !sidebar.contains(event.target) &&
                !sidebarToggle.contains(event.target)
            ) {
                sidebar.classList.remove("sidebar-open");
            }
        });
    }


    // =================================================
    // 04. USER AUTHENTICATION
    // =================================================

    let savedUser = null;

    try {

        const storedUser =
            sessionStorage.getItem("elninoUser");

        savedUser = storedUser
            ? JSON.parse(storedUser)
            : null;

    } catch (error) {

        console.error("Unable to read saved user details:", error);
    }


    function displayUser(user) {

        if (!user || typeof user !== "object") {
            console.warn("Dashboard user details unavailable.");
            return;
        }

        const profile =
            user.user && typeof user.user === "object"
                ? { ...user, ...user.user }
                : user;

        const name = String(
            profile.full_name ||
            profile.name ||
            profile.username ||
            profile.display_name ||
            "Climate User"
        ).trim();

        const email = String(
            profile.email || "Account dashboard"
        ).trim();

        if (userNameElement) {
            userNameElement.textContent = name;
        }

        if (userEmailElement) {
            userEmailElement.textContent = email;
        }

        if (avatarElement) {
            avatarElement.textContent =
                name.charAt(0).toUpperCase() || "U";
        }
    }

    displayUser(savedUser);

    document.addEventListener(
        "elnino:languagechange",
        function () {
            displayUser(savedUser);
        }
    );

    const token =
        sessionStorage.getItem("elninoAccessToken");


    // =================================================
    // 05. REGIONAL CLIMATE RISK
    // =================================================

    let regionalRiskData = null;

    function renderRegionalRisk() {

        if (!regionalRiskData) return;

        const levelElement =
            document.getElementById("regionalRiskValue");

        const descriptionElement =
            document.getElementById("regionalRiskDescription");

        const rainfallElement =
            document.getElementById("rainfallDeficitValue");

        const temperatureElement =
            document.getElementById("temperatureAnomalyValue");

        if (!levelElement) return;

        const result = regionalRiskData;

        if (!result.success || !result.data_available) {

            levelElement.textContent =
                dashboardTranslate("unavailable");

            if (descriptionElement) {
                descriptionElement.textContent =
                    dashboardTranslate("noHistoricalData");
            }

            if (rainfallElement) {
                rainfallElement.textContent =
                    `${dashboardTranslate("rainfallDeficit")}: —`;
            }

            if (temperatureElement) {
                temperatureElement.textContent =
                    `${dashboardTranslate("temperatureAnomaly")}: —`;
            }

            return;
        }

        const indicators =
            result.regional_indicators || {};

        const rainfall =
            indicators.rainfall_deficit || {};

        const temperature =
            indicators.temperature_anomaly || {};

        const overallLevel =
            result.overall_climate_assessment?.level;

        const locationName =
            result.location?.location_name ||
            result.location_name ||
            "Selected location";

        levelElement.textContent =
            translateClimateCondition(overallLevel);

        if (descriptionElement) {
            descriptionElement.textContent =
                `${locationName} · ${dashboardTranslate("regionalAssessment")}`;
        }

        if (rainfallElement) {

            const value = rainfall.value_percent;

            rainfallElement.textContent =
                value !== null && value !== undefined
                    ? `${dashboardTranslate("rainfallDeficit")}: ${Number(value).toFixed(2)}% · ${translateClimateCondition(rainfall.condition)}`
                    : `${dashboardTranslate("rainfallDeficit")}: —`;
        }

        if (temperatureElement) {

            const value = temperature.value_c;

            temperatureElement.textContent =
                value !== null && value !== undefined
                    ? `${dashboardTranslate("temperatureAnomaly")}: ${Number(value).toFixed(2)}°C · ${translateClimateCondition(temperature.condition)}`
                    : `${dashboardTranslate("temperatureAnomaly")}: —`;
        }
    }


    window.loadDashboardRegionalRisk = async function (locationId) {

        if (!locationId || !token) {
            console.warn("Regional Risk: location or token unavailable.");
            return;
        }

        const levelElement =
            document.getElementById("regionalRiskValue");

        const descriptionElement =
            document.getElementById("regionalRiskDescription");

        if (!levelElement) return;

        levelElement.textContent =
            dashboardTranslate("loading");

        if (descriptionElement) {
            descriptionElement.textContent =
                dashboardTranslate("analyzingClimate");
        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/climate/${encodeURIComponent(locationId)}/regional-risk?start_year=2020&end_year=2025`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    },
                    cache: "no-store"
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Regional Risk API failed: HTTP ${response.status}`
                );
            }

            regionalRiskData = await response.json();

            renderRegionalRisk();

            console.log(
                "LIVE REGIONAL CLIMATE RISK:",
                regionalRiskData
            );

        } catch (error) {

            console.error("Regional Climate Risk loading failed:", error);

            levelElement.textContent =
                dashboardTranslate("unavailable");

            if (descriptionElement) {
                descriptionElement.textContent =
                    dashboardTranslate("unableRegional");
            }

            const rainfallElement =
                document.getElementById("rainfallDeficitValue");

            const temperatureElement =
                document.getElementById("temperatureAnomalyValue");

            if (rainfallElement) {
                rainfallElement.textContent =
                    `${dashboardTranslate("rainfallDeficit")}: —`;
            }

            if (temperatureElement) {
                temperatureElement.textContent =
                    `${dashboardTranslate("temperatureAnomaly")}: —`;
            }
        }
    };

    document.addEventListener(
        "elnino:languagechange",
        renderRegionalRisk
    );


    // =================================================
    // 06. VERIFY AUTHENTICATED USER
    // =================================================

    if (token) {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/auth/me`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                }
            );

            if (response.status === 401) {

                sessionStorage.removeItem("elninoAccessToken");
                sessionStorage.removeItem("elninoUser");

                if (userNameElement) {
                    userNameElement.textContent = "Session expired";
                }

                if (userEmailElement) {
                    userEmailElement.textContent =
                        "Please log in again";
                }

                return;
            }

            if (!response.ok) {
                throw new Error(
                    `Profile request failed: ${response.status}`
                );
            }

            const data = await response.json();

            const apiUser =
                data?.user ||
                data?.data?.user ||
                null;

            if (apiUser && typeof apiUser === "object") {

                savedUser = {
                    ...(savedUser || {}),
                    ...apiUser
                };

                sessionStorage.setItem(
                    "elninoUser",
                    JSON.stringify(savedUser)
                );

                displayUser(savedUser);

            } else if (savedUser) {
                displayUser(savedUser);
            }

        } catch (error) {

            console.error("Dashboard profile request failed:", error);
        }
    }


    // =================================================
    // 07. DASHBOARD WEATHER
    // =================================================

    async function loadDashboardWeather() {

        if (!token) return;

        try {

            const locationsResponse = await fetch(
                `${API_BASE_URL}/api/locations/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                }
            );

            if (!locationsResponse.ok) {
                throw new Error(
                    `Unable to load locations: ${locationsResponse.status}`
                );
            }

            const locationsData =
                await locationsResponse.json();

            const locations =
                locationsData.locations || [];

            const selectedLocation =
                locations.find(location => location.is_default) ||
                locations[0];

            if (!selectedLocation) return;

            const weatherResponse = await fetch(
                `${API_BASE_URL}/api/locations/${selectedLocation.location_id}/weather`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                }
            );

            if (!weatherResponse.ok) {
                throw new Error(
                    `Unable to load weather: ${weatherResponse.status}`
                );
            }

            const result = await weatherResponse.json();

            const weather = result?.weather;

            if (!weather || typeof weather !== "object") {
                throw new Error("Weather data is unavailable.");
            }

            window.updateDashboardWeatherCards(weather);

            if (typeof window.loadDashboardRegionalRisk === "function") {
                await window.loadDashboardRegionalRisk(
                    selectedLocation.location_id
                );
            }

            console.log("DASHBOARD WEATHER DETAILS:", {
                location: selectedLocation.location_name,
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                source: weather.source,
                source_type: weather.source_type,
                timestamp: weather.updated_at,
                station_name: weather.station_name,
                station_distance_km: weather.station_distance_km,
                temperature: weather.temperature,
                humidity: weather.humidity,
                precipitation: weather.precipitation,
                wind_speed: weather.wind_speed
            });

        } catch (error) {

            console.error("Dashboard weather loading failed:", error);
        }
    }

    await loadDashboardWeather();


    // =================================================
    // 08. LOGOUT
    // =================================================

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            sessionStorage.removeItem("elninoAccessToken");
            sessionStorage.removeItem("elninoUser");

            window.location.href = "login.html";
        });
    }

});
// =====================================================
// EL NINO AI - MULTILINGUAL MAP SYSTEM
// MapLibre | English | Telugu | Hindi
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const API_BASE_URL = "http://127.0.0.1:8000";


    // =================================================
    // 01. MAP HTML ELEMENTS
    // =================================================

    const openButton =
        document.getElementById("openLocationPickerButton");

    const modal =
        document.getElementById("locationPickerModal");

    const closeButton =
        document.getElementById("closeLocationPickerButton");

    const backdrop =
        document.getElementById("locationModalBackdrop");

    const searchForm =
        document.getElementById("locationSearchForm");

    const searchInput =
        document.getElementById("locationSearchInput");

    const searchButton =
        document.getElementById("locationSearchButton");

    const searchMessage =
        document.getElementById("locationSearchMessage");

    const searchResults =
        document.getElementById("locationSearchResults");

    const selectedDetails =
        document.getElementById("selectedLocationDetails");

    const saveButton =
        document.getElementById("saveSelectedLocation");

    const selectedNameElement =
        document.getElementById("selectedLocationName");


    // =================================================
    // 02. MAP STATE
    // =================================================

    let map = null;

    let selectedMarker = null;

    let selectedLocation = null;

    let savedLocations = [];

    let currentLocation = null;

    let locationsLoaded = false;

    let isSavingLocation = false;

    let activeMapMessageKey = "mapSearchStart";

    let geocodeQueue = Promise.resolve();

    let lastGeocodeRequestAt = 0;


    // =================================================
    // 03. MAP TRANSLATIONS
    // =================================================

    const MAP_TRANSLATIONS = {

        en: {
            mapAuthRequired: "Please log in to manage locations.",
            mapLibraryFailed: "Map library could not load. Check your internet connection.",
            mapSearching: "Searching locations...",
            mapNoResults: "No locations found. Try another search.",
            mapIdentifying: "Identifying selected location...",
            mapSelectedSave: "Location identified. Click Use This Location to save it.",
            mapSearchFailed: "Could not identify that map point. Try searching for a nearby place.",
            mapSearchStart: "Search for a city or click a point on the map.",
            mapSaved: "Location saved successfully.",
            mapSaveFailed: "Unable to save this location.",
            mapSelectFirst: "Select a location first.",
            mapNoSelection: "No location selected yet.",
            mapSaving: "Saving...",
            mapLocationSelected: "Location selected. Click Use This Location to save it.",
            useThisLocation: "Use This Location",
            search: "Search",
            searchPlaceholder: "Search city, village or location...",
            chooseLocation: "Choose a location",
            locationUnavailable: "Location unavailable",
            invalidCoordinates: "Invalid location coordinates.",
            unnamedLocation: "Unnamed location",
            selectedPoint: "Selected map point",
            searchEmpty: "Enter a city or place to search.",
            weatherUnavailable: "Weather data is unavailable.",
            resultError: "Unable to load location results."
        },

        te: {
            mapAuthRequired: "Locations manage cheyadaniki mundu login avvandi.",
            mapLibraryFailed: "Map load avvaledu. Internet connection check cheyyandi.",
            mapSearching: "Locations search chestunnam...",
            mapNoResults: "Locations dorakaledu. Vere place search cheyyandi.",
            mapIdentifying: "Selected location ni identify chestunnam...",
            mapSelectedSave: "Location identify ayyindi. Save cheyadaniki Use This Location click cheyyandi.",
            mapSearchFailed: "Ee map point ni identify cheyalekapoyam. Daggaralo unna place search cheyyandi.",
            mapSearchStart: "City search cheyyandi leda map meeda point select cheyyandi.",
            mapSaved: "Location successfully save ayyindi.",
            mapSaveFailed: "Location save cheyalekapoyam.",
            mapSelectFirst: "Munduga location select cheyyandi.",
            mapNoSelection: "Inka location select cheyyaledu.",
            mapSaving: "Save chestunnam...",
            mapLocationSelected: "Location select ayyindi. Save cheyadaniki Use This Location click cheyyandi.",
            useThisLocation: "Ee Location Use Cheyyandi",
            search: "Search Cheyyandi",
            searchPlaceholder: "City, village leda location search cheyyandi...",
            chooseLocation: "Location Select Cheyyandi",
            locationUnavailable: "Location available ledu",
            invalidCoordinates: "Location coordinates sarigga levu.",
            unnamedLocation: "Peru leni location",
            selectedPoint: "Select chesina map point",
            searchEmpty: "Search cheyadaniki city leda place enter cheyyandi.",
            weatherUnavailable: "Weather data available ledu.",
            resultError: "Location results load cheyalekapoyam."
        },

        hi: {
            mapAuthRequired: "Locations manage karne ke liye pehle login karein.",
            mapLibraryFailed: "Map load nahi hua. Internet connection check karein.",
            mapSearching: "Locations search ho rahi hain...",
            mapNoResults: "Koi location nahi mili. Dusri jagah search karein.",
            mapIdentifying: "Selected location identify ho rahi hai...",
            mapSelectedSave: "Location identify ho gayi. Save karne ke liye Use This Location click karein.",
            mapSearchFailed: "Is map point ko identify nahi kar sake. Paas ki jagah search karein.",
            mapSearchStart: "City search karein ya map par point select karein.",
            mapSaved: "Location successfully save ho gayi.",
            mapSaveFailed: "Location save nahi ho saki.",
            mapSelectFirst: "Pehle location select karein.",
            mapNoSelection: "Abhi koi location select nahi hui.",
            mapSaving: "Save ho rahi hai...",
            mapLocationSelected: "Location select ho gayi. Save karne ke liye Use This Location click karein.",
            useThisLocation: "Is Location Ka Use Karein",
            search: "Search",
            searchPlaceholder: "City, village ya location search karein...",
            chooseLocation: "Location Select Karein",
            locationUnavailable: "Location available nahi hai",
            invalidCoordinates: "Location coordinates sahi nahi hain.",
            unnamedLocation: "Unnamed location",
            selectedPoint: "Selected map point",
            searchEmpty: "Search ke liye city ya place enter karein.",
            weatherUnavailable: "Weather data available nahi hai.",
            resultError: "Location results load nahi ho sake."
        }

    };


    // =================================================
    // 04. LANGUAGE MANAGEMENT
    // =================================================

    function getCurrentLanguage() {

        const language =
            window.ElNinoLanguage?.getLanguage?.() ||
            localStorage.getItem("elninoLanguage") ||
            "en";

        return MAP_TRANSLATIONS[language]
            ? language
            : "en";
    }


    function t(key) {

        const language = getCurrentLanguage();

        return (
            MAP_TRANSLATIONS[language]?.[key] ||
            MAP_TRANSLATIONS.en[key] ||
            key
        );
    }


    function getAcceptLanguage() {

        const languages = {
            en: "en,en-US",
            te: "te,te-IN,en",
            hi: "hi,hi-IN,en"
        };

        return languages[getCurrentLanguage()] || "en";
    }


    // =================================================
    // 05. MAP UI LANGUAGE UPDATE
    // =================================================

    function updateMapLanguage() {

        if (searchInput) {
            searchInput.placeholder = t("searchPlaceholder");
        }

        if (searchButton) {
            searchButton.textContent = t("search");
        }

        if (saveButton && !isSavingLocation) {
            saveButton.textContent = t("useThisLocation");
        }

        if (activeMapMessageKey && searchMessage) {
            searchMessage.textContent = t(activeMapMessageKey);
        }

        if (selectedNameElement && !currentLocation) {
            selectedNameElement.textContent = t("chooseLocation");
        }

        if (selectedDetails && !selectedLocation) {
            selectedDetails.textContent = t("mapNoSelection");
        }

        updateMarkerLanguage();
    }


    // =================================================
    // 06. AUTHENTICATION HELPERS
    // =================================================

    function getToken() {

        return sessionStorage.getItem("elninoAccessToken");
    }


    function authHeaders() {

        const token = getToken();

        if (!token) {
            throw new Error(t("mapAuthRequired"));
        }

        return {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
        };
    }


    // =================================================
    // 07. MAP MESSAGE SYSTEM
    // =================================================

    function showMessage(key) {

        activeMapMessageKey = key;

        if (searchMessage) {
            searchMessage.textContent = t(key);
        }
    }


    // =================================================
    // 08. LOCATION NORMALIZATION
    // =================================================

    function getPlaceName(address, result) {

        return (
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.suburb ||
            address.hamlet ||
            address.county ||
            result.name ||
            result.display_name?.split(",")[0] ||
            t("selectedPoint")
        );
    }


    function normalizePlace(result) {

        const address = result.address || {};

        const place = {

            name: getPlaceName(address, result),

            location_name: getPlaceName(address, result),

            state:
                address.state ||
                address.region ||
                "",

            country:
                address.country ||
                "India",

            latitude:
                Number(result.lat ?? result.latitude),

            longitude:
                Number(result.lon ?? result.longitude),

            display_name:
                result.display_name || ""

        };

        return isValidCoordinates(place)
            ? place
            : null;
    }


    function isValidCoordinates(location) {

        return (
            location &&
            Number.isFinite(Number(location.latitude)) &&
            Number.isFinite(Number(location.longitude)) &&
            Number(location.latitude) >= -90 &&
            Number(location.latitude) <= 90 &&
            Number(location.longitude) >= -180 &&
            Number(location.longitude) <= 180
        );
    }


    // =================================================
    // 09. GEOCODING REQUEST QUEUE
    // =================================================

    function requestGeocoding(url) {

        const task = geocodeQueue.then(async function () {

            const elapsed =
                Date.now() - lastGeocodeRequestAt;

            const remaining = Math.max(
                0,
                1100 - elapsed
            );

            if (remaining > 0) {
                await new Promise(resolve =>
                    setTimeout(resolve, remaining)
                );
            }

            lastGeocodeRequestAt = Date.now();

            const response = await fetch(url, {
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(
                    `Location request failed: HTTP ${response.status}`
                );
            }

            return response.json();
        });

        geocodeQueue = task.catch(() => undefined);

        return task;
    }


    // =================================================
    // 10. CREATE GEOCODING URL
    // =================================================

    function createGeocodingURL(endpoint, parameters) {

        const url = new URL(
            `https://nominatim.openstreetmap.org/${endpoint}`
        );

        url.search = new URLSearchParams({
            ...parameters,
            "accept-language": getAcceptLanguage()
        });

        return url.toString();
    }


    // =================================================
    // 11. MAPLIBRE INITIALIZATION
    // =================================================

    function initializeMap() {

        if (map) {
            setTimeout(() => map.resize(), 150);
            return;
        }

        if (!window.maplibregl) {
            showMessage("mapLibraryFailed");
            return;
        }

        const mapContainer =
            document.getElementById("locationMap");

        if (!mapContainer) {
            console.error("Map container #locationMap not found.");
            return;
        }

        map = new maplibregl.Map({

            container: "locationMap",

            style: "https://tiles.openfreemap.org/styles/liberty",

            center: [82.0, 16.5],

            zoom: 8,

            minZoom: 3,

            maxZoom: 19,

            pitch: 0,

            bearing: 0,

            attributionControl: true
        });


        map.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );


        // =============================================
        // MAP LOAD EVENT
        // =============================================

        map.on("load", function () {

            console.log("MAP LOADED SUCCESSFULLY");

            map.resize();

            const style = map.getStyle();

            const layers = style.layers || [];

            let labelCount = 0;

            layers.forEach(function (layer) {

                if (
                    layer.type !== "symbol" ||
                    !layer.layout ||
                    !layer.layout["text-field"]
                ) {
                    return;
                }

                labelCount++;

                map.setLayoutProperty(
                    layer.id,
                    "visibility",
                    "visible"
                );

                if (
                    layer.paint &&
                    layer.paint["text-halo-width"] !== undefined
                ) {
                    map.setPaintProperty(
                        layer.id,
                        "text-halo-width",
                        1.5
                    );
                }

                if (
                    layer.paint &&
                    layer.paint["text-halo-color"] !== undefined
                ) {
                    map.setPaintProperty(
                        layer.id,
                        "text-halo-color",
                        "#ffffff"
                    );
                }
            });

            console.log("Total label layers:", labelCount);


            // =========================================
            // SHOW IMPORTANT MAP LANDMARKS EARLIER
            // =========================================

            let poiLayerCount = 0;

            layers.forEach(function (layer) {

                if (
                    layer.type === "symbol" &&
                    layer.id.startsWith("poi_")
                ) {

                    map.setLayerZoomRange(
                        layer.id,
                        13,
                        layer.maxzoom ?? 24
                    );

                    map.setLayoutProperty(
                        layer.id,
                        "visibility",
                        "visible"
                    );

                    poiLayerCount++;
                }
            });

            console.log(
                "POI landmark layers enabled:",
                poiLayerCount
            );

            updateVectorMapLanguage();
        });


        // =============================================
        // MAP ERRORS
        // =============================================

        map.on("error", function (event) {

            console.error(
                "MAP LOADING ERROR:",
                event.error
            );
        });


        // =============================================
        // MAP STYLE LANGUAGE
        // =============================================

        map.on("style.load", function () {
            updateVectorMapLanguage();
        });


        // =============================================
        // MAP CLICK - REVERSE GEOCODING
        // =============================================

        map.on("click", async function (event) {

            const latitude = event.lngLat.lat;
            const longitude = event.lngLat.lng;

            showMessage("mapIdentifying");

            try {

                const url = createGeocodingURL(
                    "reverse",
                    {
                        format: "jsonv2",
                        lat: latitude.toString(),
                        lon: longitude.toString(),
                        addressdetails: "1"
                    }
                );

                const result = await requestGeocoding(url);

                if (!result || !result.address) {
                    showMessage("mapSearchFailed");
                    return;
                }

                const place = normalizePlace(result);

                if (!place) {
                    showMessage("mapSearchFailed");
                    return;
                }

                setSelectedPlace(place);

                showMessage("mapSelectedSave");

            } catch (error) {

                console.error(
                    "Map reverse geocoding failed:",
                    error
                );

                showMessage("mapSearchFailed");
            }
        });
    }


    // =================================================
    // 12. VECTOR MAP LANGUAGE SWITCHING
    // =================================================

    function updateVectorMapLanguage() {

        if (!map || !map.isStyleLoaded()) {
            return;
        }

        const language = getCurrentLanguage();

        const languageFields = {

            en: ["name:en", "name_en"],

            te: ["name:te", "name_te"],

            hi: ["name:hi", "name_hi"]
        };

        const fields =
            languageFields[language] || languageFields.en;

        const layers = map.getStyle().layers || [];

        layers.forEach(function (layer) {

            if (
                layer.type !== "symbol" ||
                !layer.layout ||
                !layer.layout["text-field"]
            ) {
                return;
            }

            const textExpression = [
                "coalesce",
                ...fields.map(field => ["get", field]),
                ["get", "name"]
            ];

            try {

                map.setLayoutProperty(
                    layer.id,
                    "text-field",
                    textExpression
                );

            } catch (error) {

                console.warn(
                    "Map language update failed:",
                    layer.id,
                    error
                );
            }
        });
    }


    // =================================================
    // 13. SET SELECTED PLACE
    // =================================================

    function setSelectedPlace(place) {

        if (!place || !isValidCoordinates(place)) {

            showMessage("mapSearchFailed");

            return;
        }

        selectedLocation = {

            name:
                place.name ||
                place.location_name ||
                t("unnamedLocation"),

            state:
                place.state || "",

            country:
                place.country || "India",

            latitude:
                Number(place.latitude),

            longitude:
                Number(place.longitude)
        };


        if (map) {

            map.flyTo({

                center: [
                    selectedLocation.longitude,
                    selectedLocation.latitude
                ],

                zoom: 13,

                essential: true
            });


            if (selectedMarker) {
                selectedMarker.remove();
                selectedMarker = null;
            }


            const markerElement =
                document.createElement("div");

            markerElement.className =
                "location-map-marker";


            const popup = new maplibregl.Popup({

                offset: 25,

                closeButton: false

            }).setText(selectedLocation.name);


            selectedMarker = new maplibregl.Marker({

                element: markerElement

            })
                .setLngLat([
                    selectedLocation.longitude,
                    selectedLocation.latitude
                ])
                .setPopup(popup)
                .addTo(map);

            selectedMarker.togglePopup();
        }


        if (selectedDetails) {

            selectedDetails.textContent = [
                selectedLocation.name,
                selectedLocation.state,
                selectedLocation.country
            ].filter(Boolean).join(", ");
        }


        if (saveButton) {
            saveButton.disabled = false;
        }

        showMessage("mapSelectedSave");
    }


    // =================================================
    // 14. UPDATE MARKER LANGUAGE
    // =================================================

    function updateMarkerLanguage() {

        if (!selectedMarker || !selectedLocation) {
            return;
        }

        const popup = selectedMarker.getPopup();

        if (popup) {
            popup.setText(selectedLocation.name);
        }
    }


    // =================================================
    // 15. LOAD SAVED LOCATIONS
    // =================================================

    async function loadSavedLocations(refreshWeather = false) {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/locations/`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Unable to load saved locations: ${response.status}`
                );
            }

            const data = await response.json();

            savedLocations = Array.isArray(data.locations)
                ? data.locations
                : [];

            locationsLoaded = true;

            currentLocation =
                savedLocations.find(location => location.is_default) ||
                savedLocations[0] ||
                null;


            if (selectedNameElement) {

                selectedNameElement.textContent =
                    currentLocation
                        ? currentLocation.location_name
                        : t("chooseLocation");
            }


            if (selectedDetails && !selectedLocation) {

                selectedDetails.textContent =
                    currentLocation
                        ? currentLocation.location_name
                        : t("mapNoSelection");
            }


            if (refreshWeather && currentLocation) {

                await refreshDashboardWeather(
                    currentLocation.location_id
                );
            }

            return savedLocations;

        } catch (error) {

            console.error("Saved locations error:", error);

            locationsLoaded = false;

            throw error;
        }
    }


    // =================================================
    // 16. REFRESH DASHBOARD WEATHER
    // =================================================

    async function refreshDashboardWeather(locationId) {

        if (!locationId) return;

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/locations/${encodeURIComponent(locationId)}/weather`,
                {
                    method: "GET",
                    headers: authHeaders()
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Weather request failed: ${response.status}`
                );
            }

            const result = await response.json();

            if (!result.weather) {
                throw new Error("Weather data unavailable.");
            }

            window.updateDashboardWeatherCards(result.weather);

            if (
                typeof window.loadDashboardRegionalRisk === "function"
            ) {
                await window.loadDashboardRegionalRisk(locationId);
            }

        } catch (error) {

            console.error(
                "Dashboard weather refresh error:",
                error
            );
        }
    }
    // =================================================
    // 17. OPEN MAP MODAL
    // =================================================

    if (openButton) {

        openButton.addEventListener("click", async function () {

            if (modal) {
                modal.hidden = false;
                document.body.style.overflow = "hidden";
            }

            updateMapLanguage();

            try {

                if (!locationsLoaded) {
                    await loadSavedLocations(false);
                }

                initializeMap();

                if (currentLocation) {

                    setSelectedPlace({

                        name: currentLocation.location_name,

                        state: currentLocation.state,

                        country: currentLocation.country,

                        latitude: Number(currentLocation.latitude),

                        longitude: Number(currentLocation.longitude)
                    });

                    showMessage("mapSearchStart");

                } else {

                    selectedLocation = null;

                    if (selectedMarker) {
                        selectedMarker.remove();
                        selectedMarker = null;
                    }

                    if (saveButton) {
                        saveButton.disabled = true;
                    }

                    if (selectedDetails) {
                        selectedDetails.textContent =
                            t("mapNoSelection");
                    }

                    showMessage("mapSearchStart");
                }

                setTimeout(function () {

                    if (map) {
                        map.resize();
                    }

                }, 150);

            } catch (error) {

                console.error(
                    "Map modal initialization error:",
                    error
                );

                showMessage("mapAuthRequired");
            }
        });
    }


    // =================================================
    // 18. CLOSE MAP MODAL
    // =================================================

    function closeLocationPickerModal() {

        if (modal) {
            modal.hidden = true;
        }

        document.body.style.overflow = "";
    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeLocationPickerModal
        );
    }


    if (backdrop) {

        backdrop.addEventListener("click", function () {
            closeLocationPickerModal();
        });
    }


    if (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {
                closeLocationPickerModal();
            }
        });
    }


    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            modal &&
            !modal.hidden
        ) {
            closeLocationPickerModal();
        }
    });
    function escapeHTML(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    // =================================================
    // 19. PHOTON CITY / VILLAGE AUTOCOMPLETE
    // =================================================

    if (searchInput) {

        let autocompleteTimer = null;

        let autocompleteController = null;

        let autocompleteRequestId = 0;


        // =============================================
        // NORMALIZE PLACE NAME
        // =============================================

        function normalizeSearchText(value) {

            return String(value || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .trim();
        }


        // =============================================
        // SEARCH INPUT EVENT
        // =============================================

        searchInput.addEventListener("input", function () {

            const query = searchInput.value.trim();

            clearTimeout(autocompleteTimer);


            if (autocompleteController) {

                autocompleteController.abort();

                autocompleteController = null;
            }


            const requestId = ++autocompleteRequestId;


            if (query.length < 2) {

                if (searchResults) {

                    searchResults.innerHTML = "";

                    searchResults.style.display = "none";

                    searchResults.hidden = true;
                }

                return;
            }


            autocompleteTimer = setTimeout(async function () {

                try {

                    autocompleteController =
                        new AbortController();


                    // =================================
                    // PHOTON API REQUEST
                    // =================================

                    const params = new URLSearchParams({

                        q: query,

                        limit: "50",

                        lang: "en",

                        countrycode: "IN",

                        dedupe: "0"

                    });

                    params.append("osm_tag", "place");


                    const url =
                        `https://photon.komoot.io/api/?${params.toString()}`;


                    const response = await fetch(url, {

                        method: "GET",

                        signal: autocompleteController.signal,

                        headers: {
                            Accept: "application/json"
                        }
                    });


                    if (!response.ok) {

                        throw new Error(
                            `Photon API failed: ${response.status}`
                        );
                    }


                    const data = await response.json();


                    if (requestId !== autocompleteRequestId) {
                        return;
                    }


                    const features = Array.isArray(data.features)
                        ? data.features
                        : [];


                    const normalizedQuery =
                        normalizeSearchText(query);


                    // =================================
                    // ALLOWED CITY / VILLAGE TYPES
                    // =================================

                    const allowedPlaceTypes = [

                        "city",

                        "town",

                        "village",

                        "hamlet",

                        "suburb",

                        "locality",

                        "isolated_dwelling",

                        "neighbourhood",

                        "municipality"

                    ];


                    const uniquePlaces = new Map();


                    // =================================
                    // FILTER PHOTON RESULTS
                    // =================================

                    features.forEach(function (feature) {

                        const properties =
                            feature.properties || {};


                        const coordinates =
                            feature.geometry?.coordinates || [];


                        if (coordinates.length < 2) {
                            return;
                        }


                        const longitude =
                            Number(coordinates[0]);

                        const latitude =
                            Number(coordinates[1]);


                        // Validate Photon coordinates directly

                        if (
                            !Number.isFinite(latitude) ||
                            !Number.isFinite(longitude) ||
                            latitude < -90 ||
                            latitude > 90 ||
                            longitude < -180 ||
                            longitude > 180
                        ) {
                            return;
                        }


                        // India only

                        const countryCode =
                            String(properties.countrycode || "")
                                .toUpperCase();

                        const country =
                            String(properties.country || "");


                        if (
                            countryCode &&
                            countryCode !== "IN"
                        ) {
                            return;
                        }


                        if (
                            country &&
                            !country.toLowerCase().includes("india")
                        ) {
                            return;
                        }


                        // =================================
                        // PLACE TYPE FILTER
                        // =================================

                        const osmKey =
                            String(properties.osm_key || "")
                                .toLowerCase();

                        const osmValue =
                            String(properties.osm_value || "")
                                .toLowerCase();


                        if (
                            osmKey !== "place" ||
                            !allowedPlaceTypes.includes(osmValue)
                        ) {
                            return;
                        }


                        // =================================
                        // NAME MATCHING
                        // =================================

                        const name =
                            properties.name ||
                            properties.name_en ||
                            properties.name_te ||
                            properties.name_hi ||
                            "";


                        if (!name) {
                            return;
                        }


                        const searchableNames = [

                            properties.name,

                            properties.name_en,

                            properties.name_te,

                            properties.name_hi

                        ]
                            .filter(Boolean)
                            .map(normalizeSearchText);


                        const isMatching =
                            searchableNames.some(function (placeName) {

                                return placeName.includes(normalizedQuery);

                            });


                        if (!isMatching) {
                            return;
                        }


                        // =================================
                        // UNIQUE LOCATION IDENTIFICATION
                        // =================================

                        const uniqueKey =

                            properties.osm_type &&
                            properties.osm_id

                                ? `${properties.osm_type}-${properties.osm_id}`

                                : `${normalizeSearchText(name)}-${latitude.toFixed(5)}-${longitude.toFixed(5)}`;


                        if (uniquePlaces.has(uniqueKey)) {
                            return;
                        }


                        uniquePlaces.set(uniqueKey, {

                            name: name,

                            location_name: name,

                            state:
                                properties.state || "",

                            country:
                                country || "India",

                            district:
                                properties.district ||
                                properties.county ||
                                "",

                            latitude,

                            longitude,

                            osm_type:
                                properties.osm_type || "",

                            osm_id:
                                properties.osm_id || ""

                        });

                    });


                    // =================================
                    // SORT MATCHING LOCATIONS
                    // =================================

                    const places =
                        Array.from(uniquePlaces.values());


                    places.sort(function (a, b) {

                        const aName =
                            normalizeSearchText(a.name);

                        const bName =
                            normalizeSearchText(b.name);


                        // Exact matches first

                        const aExact =
                            aName === normalizedQuery;

                        const bExact =
                            bName === normalizedQuery;


                        if (aExact !== bExact) {

                            return aExact ? -1 : 1;
                        }


                        // Names starting with query next

                        const aPrefix =
                            aName.startsWith(normalizedQuery);

                        const bPrefix =
                            bName.startsWith(normalizedQuery);


                        if (aPrefix !== bPrefix) {

                            return aPrefix ? -1 : 1;
                        }


                        // Andhra Pradesh priority

                        const aAP =
                            a.state.toLowerCase()
                                .includes("andhra pradesh");

                        const bAP =
                            b.state.toLowerCase()
                                .includes("andhra pradesh");


                        if (aAP !== bAP) {

                            return aAP ? -1 : 1;
                        }


                        return aName.localeCompare(bName);

                    });


                    // =================================
                    // DISPLAY SEARCH RESULTS
                    // =================================

                    if (!searchResults) {
                        return;
                    }
                    if (searchMessage) {
                        searchMessage.textContent = "";
                        searchMessage.style.display = "none";
                        searchMessage.hidden = true;
                    }

                    searchResults.innerHTML = "";


                    if (places.length === 0) {

                        searchResults.hidden = true;

                        searchResults.style.display = "none";

                        showMessage("mapNoResults");

                        return;
                    }


                    places.forEach(function (place) {

                        const button =
                            document.createElement("button");


                        button.type = "button";

                        button.className =
                            "location-search-result";


                        const locationParts = [

                            place.name,

                            place.district,

                            place.state,

                            place.country

                        ].filter(Boolean);


                        const uniqueParts = [

                            ...new Set(

                                locationParts.map(function (part) {

                                    return part.trim();

                                })

                            )

                        ];


                        button.innerHTML = `
                            <span class="location-result-name">
                                ${escapeHTML(place.name)}
                            </span>

                            <span class="location-result-details">
                                ${escapeHTML(place.district || "")}
                            </span>

                            <span class="location-result-region">
                                ${escapeHTML(place.state || "")}
                                ${place.state ? " · " : ""}
                                ${escapeHTML(place.country || "India")}
                            </span>
                        `;


                        // =================================
                        // SELECT LOCATION
                        // =================================

                        button.addEventListener(
                            "click",
                            function () {

                                setSelectedPlace(place);


                                searchInput.value =
                                    place.name;


                                searchResults.innerHTML = "";

                                searchResults.hidden = true;

                                searchResults.style.display = "none";


                                showMessage("mapLocationSelected");

                            }
                        );


                        searchResults.appendChild(button);

                    });


                    searchResults.hidden = false;

                    searchResults.style.display = "block";


                    console.log(
                        "PHOTON MATCHING LOCATIONS:",
                        places
                    );


                } catch (error) {

                    if (error.name !== "AbortError") {

                        console.error(
                            "Location autocomplete error:",
                            error
                        );

                        showMessage("resultError");
                    }
                }

            }, 350);

        });

    }


    // =================================================
    // 20. NOMINATIM SEARCH FORM
    // =================================================

    if (searchForm) {

        searchForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const query = searchInput
                    ? searchInput.value.trim()
                    : "";


                if (!query) {

                    showMessage("searchEmpty");

                    return;
                }


                showMessage("mapSearching");


                if (searchButton) {
                    searchButton.disabled = true;
                }


                if (searchResults) {

                    searchResults.innerHTML = "";

                    searchResults.hidden = true;

                    searchResults.style.display = "none";
                }


                try {

                    const url = createGeocodingURL(
                        "search",
                        {
                            format: "jsonv2",
                            q: query,
                            addressdetails: "1",
                            limit: "10",
                            countrycodes: "in"
                        }
                    );


                    // requestGeocoding returns JSON directly.

                    const results =
                        await requestGeocoding(url);


                    if (
                        !Array.isArray(results) ||
                        results.length === 0
                    ) {

                        showMessage("mapSearchFailed");

                        return;
                    }


                    if (!searchResults) {

                        showMessage("mapSearchFailed");

                        return;
                    }


                    searchResults.innerHTML = "";


                    results.forEach(function (result) {

                        const place =
                            normalizePlace(result);

                        if (!place) {
                            return;
                        }


                        const button =
                            document.createElement("button");

                        button.type = "button";

                        button.className =
                            "location-search-result";

                        button.textContent =
                            place.display_name ||
                            place.location_name;


                        button.addEventListener("click", function () {

                            setSelectedPlace(place);

                            if (searchInput) {
                                searchInput.value = place.name;
                            }

                            searchResults.innerHTML = "";

                            searchResults.hidden = true;

                            searchResults.style.display = "none";

                            showMessage("mapLocationSelected");
                        });


                        searchResults.appendChild(button);
                    });


                    if (searchResults.children.length > 0) {

                        searchResults.hidden = false;

                        searchResults.style.display = "block";

                    } else {

                        showMessage("mapSearchFailed");
                    }


                } catch (error) {

                    console.error(
                        "Nominatim search error:",
                        error
                    );

                    showMessage("mapSearchFailed");

                } finally {

                    if (searchButton) {
                        searchButton.disabled = false;
                    }
                }
            }
        );
    }


    // =================================================
    // 21. DISTANCE BETWEEN TWO LOCATIONS
    // =================================================

    function distanceKm(lat1, lon1, lat2, lon2) {

        const earthRadius = 6371;

        const toRadians =
            value => value * Math.PI / 180;

        const dLat =
            toRadians(lat2 - lat1);

        const dLon =
            toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

        return earthRadius * c;
    }


    // =================================================
    // 22. SAVE SELECTED LOCATION
    // =================================================

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            async function () {

                if (!selectedLocation || isSavingLocation) {

                    if (!selectedLocation) {
                        showMessage("mapSelectFirst");
                    }

                    return;
                }


                isSavingLocation = true;

                saveButton.disabled = true;

                saveButton.dataset.saving = "true";

                saveButton.textContent = t("mapSaving");


                try {

                    if (!locationsLoaded) {
                        await loadSavedLocations(false);
                    }


                    const existingLocation =
                        savedLocations.find(function (location) {

                            const sameName =
                                location.location_name?.toLowerCase() ===
                                selectedLocation.name.toLowerCase();

                            const sameCountry =
                                location.country?.toLowerCase() ===
                                selectedLocation.country.toLowerCase();

                            const distance = distanceKm(

                                Number(location.latitude),

                                Number(location.longitude),

                                selectedLocation.latitude,

                                selectedLocation.longitude
                            );

                            return (
                                sameName &&
                                sameCountry &&
                                Number.isFinite(distance) &&
                                distance <= 5
                            );
                        });


                    let response;


                    if (existingLocation) {

                        response = await fetch(
                            `${API_BASE_URL}/api/locations/${existingLocation.location_id}/default`,
                            {
                                method: "PUT",
                                headers: authHeaders()
                            }
                        );

                    } else {

                        response = await fetch(
                            `${API_BASE_URL}/api/locations/`,
                            {
                                method: "POST",
                                headers: {
                                    ...authHeaders(),
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({

                                    location_name:
                                        selectedLocation.name,

                                    state:
                                        selectedLocation.state,

                                    country:
                                        selectedLocation.country,

                                    latitude:
                                        selectedLocation.latitude,

                                    longitude:
                                        selectedLocation.longitude,

                                    is_default: true
                                })
                            }
                        );
                    }


                    const result = await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.detail ||
                            "Unable to save location."
                        );
                    }


                    await loadSavedLocations(false);


                    closeLocationPickerModal();


                    if (currentLocation) {

                        if (selectedNameElement) {

                            selectedNameElement.textContent =
                                currentLocation.location_name;
                        }


                        await refreshDashboardWeather(
                            currentLocation.location_id
                        );
                    }


                    showMessage("mapSaved");


                } catch (error) {

                    console.error(
                        "Save location error:",
                        error
                    );

                    showMessage("mapSaveFailed");


                } finally {

                    isSavingLocation = false;

                    saveButton.disabled = !selectedLocation;

                    delete saveButton.dataset.saving;

                    saveButton.textContent =
                        t("useThisLocation");
                }
            }
        );
    }


    // =================================================
    // 23. LANGUAGE CHANGE LISTENER
    // =================================================

    window.addEventListener(
        "elnino:languagechange",
        function () {

            updateMapLanguage();

            updateVectorMapLanguage();

            updateMarkerLanguage();
        }
    );


    // =================================================
    // 24. INITIALIZE MAP LANGUAGE AND SAVED LOCATION
    // =================================================

    updateMapLanguage();


    loadSavedLocations(true).catch(function (error) {

        console.error(
            "Initial saved location loading failed:",
            error
        );

        if (selectedNameElement) {
            selectedNameElement.textContent =
                t("locationUnavailable");
        }
    });

});


// =====================================================
// LIVE NOAA ENSO DATA
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const ENSO_API_URL =
        "http://127.0.0.1:8000/api/enso/current";

    const ensoPhaseValue =
        document.getElementById("ensoPhaseValue");

    const ensoDescription =
        document.getElementById("ensoDescription");

    const ensoRoniValue =
        document.getElementById("ensoRoniValue");

    const ensoObservationPeriod =
        document.getElementById("ensoObservationPeriod");

    const ensoEpisodeStatus =
        document.getElementById("ensoEpisodeStatus");

    const ensoSourceValue =
        document.getElementById("ensoSourceValue");

    const ensoUpdatedAtValue =
        document.getElementById("ensoUpdatedAtValue");


    // =================================================
    // CHECK ENSO ELEMENTS
    // =================================================

    if (
        !ensoPhaseValue ||
        !ensoDescription ||
        !ensoRoniValue ||
        !ensoObservationPeriod ||
        !ensoEpisodeStatus ||
        !ensoSourceValue ||
        !ensoUpdatedAtValue
    ) {

        console.warn("ENSO dashboard elements not found.");

        return;
    }


    // =================================================
    // ENSO TRANSLATIONS
    // =================================================

    function getENSOLanguage() {

        return localStorage.getItem("elninoLanguage") || "en";
    }


    function translateENSOCondition(condition) {

        const language = getENSOLanguage();

        const translations = {

            en: {
                "El Niño": "El Niño",
                "La Niña": "La Niña",
                "Neutral": "Neutral",
                "Unavailable": "Unavailable",
                "No sustained episode confirmed": "No sustained episode confirmed"
            },

            te: {
                "El Niño": "ఎల్ నినో",
                "La Niña": "లా నినా",
                "Neutral": "తటస్థ స్థితి",
                "Unavailable": "అందుబాటులో లేదు",
                "No sustained episode confirmed": "స్థిరమైన వాతావరణ దశ నిర్ధారించబడలేదు"
            },

            hi: {
                "El Niño": "एल नीनो",
                "La Niña": "ला नीना",
                "Neutral": "तटस्थ",
                "Unavailable": "उपलब्ध नहीं",
                "No sustained episode confirmed": "कोई स्थायी जलवायु चरण पुष्टि नहीं हुआ"
            }
        };

        return translations[language]?.[condition] || condition;
    }


    // =================================================
    // FORMAT DATE
    // =================================================

    function formatENSODate(dateValue) {

        if (!dateValue) {
            return "--";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleString(
            getENSOLanguage() === "te"
                ? "te-IN"
                : getENSOLanguage() === "hi"
                    ? "hi-IN"
                    : "en-IN"
        );
    }


    // =================================================
    // RENDER ENSO DATA
    // =================================================

    let latestENSOData = null;

    function renderENSOData(data) {

        if (!data || typeof data !== "object") {
            return;
        }

        latestENSOData = data;

       const condition =
        data.enso_condition ||
        data.condition ||
        data.phase ||
        "Unavailable";

        const roniValue =
            Number(data.roni_value);

        ensoPhaseValue.textContent =
            translateENSOCondition(condition);

        ensoDescription.textContent =
            data.description ||
            "RONI · Latest climate index observation";

        ensoRoniValue.textContent =
            Number.isFinite(roniValue)
                ? `${roniValue >= 0 ? "+" : ""}${roniValue.toFixed(2)} °C`
                : "--";

        ensoObservationPeriod.textContent =
            data.observation_period ||
            data.period ||
            "--";

        ensoEpisodeStatus.textContent =
            translateENSOCondition(
                data.episode_status ||
                "No sustained episode confirmed"
            );

        ensoSourceValue.textContent =
            data.source ||
            "NOAA Climate Prediction Center";

        ensoUpdatedAtValue.textContent =
            formatENSODate(
                data.retrieved_at ||
                data.updated_at ||
                data.timestamp
            );
    }


    // =================================================
    // LOAD LIVE ENSO DATA
    // =================================================

    async function loadLiveENSOData() {

        try {

            const response = await fetch(
                ENSO_API_URL,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

            if (!response.ok) {

                throw new Error(
                    `ENSO API request failed: ${response.status}`
                );
            }

            const data = await response.json();

            if (
                data.status === "error" ||
                data.success === false
            ) {

                throw new Error(
                    data.message || "ENSO data unavailable."
                );
            }

            renderENSOData(data);

        } catch (error) {

            console.error("Live ENSO loading error:", error);

            ensoPhaseValue.textContent =
                translateENSOCondition("Unavailable");

            ensoRoniValue.textContent = "--";

            ensoObservationPeriod.textContent = "--";

            ensoEpisodeStatus.textContent = "--";

            ensoSourceValue.textContent = "--";

            ensoUpdatedAtValue.textContent = "--";

            ensoDescription.textContent =
                "Unable to retrieve the latest ENSO observation.";
        }
    }


    // =================================================
    // LANGUAGE CHANGE
    // =================================================

    window.addEventListener(
        "elnino:languagechange",
        function () {

            if (latestENSOData) {
                renderENSOData(latestENSOData);
            }
        }
    );


    // =================================================
    // INITIAL LOAD
    // =================================================

    loadLiveENSOData();


    // =================================================
    // AUTO REFRESH EVERY 30 MINUTES
    // =================================================

    setInterval(
        loadLiveENSOData,
        30 * 60 * 1000
    );

});


// =====================================================
// FALLBACK: LOAD DEFAULT SAVED LOCATION
// =====================================================

async function initializeSavedLocationName() {

    const locationElement =
        document.getElementById("selectedLocationName");

    if (!locationElement) return;

    try {

        const token =
            sessionStorage.getItem("elninoAccessToken");

        if (!token) {

            locationElement.textContent = "Login required";

            return;
        }

        const response = await fetch(
            "http://127.0.0.1:8000/api/locations/",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            throw new Error(
                `Location API error: ${response.status}`
            );
        }

        const data = await response.json();

        const defaultLocation =
            data.locations?.find(location => location.is_default) ||
            data.locations?.[0];

        locationElement.textContent =
            defaultLocation
                ? defaultLocation.location_name
                : "No saved location";

    } catch (error) {

        console.error(
            "Saved location initialization:",
            error
        );

        locationElement.textContent =
            "Location unavailable";
    }
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSavedLocationName
    );

} else {

    initializeSavedLocationName();
}    
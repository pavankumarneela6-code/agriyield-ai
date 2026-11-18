"use strict";

// =====================================================
// EL NINO AI - MULTI-LANGUAGE TRANSLATION SYSTEM
// Languages: English, Telugu, Hindi
// =====================================================

(function () {
    const LANGUAGE_STORAGE_KEY = "elninoLanguage";
    let currentLanguage = "en";

    // =====================================================
    // TRANSLATION DICTIONARIES
    // =====================================================

    const translations = {

        // =================================================
        // ENGLISH
        // =================================================
        en: {
// Home Page - About El Niño
            homeAboutEyebrow: "UNDERSTANDING THE PHENOMENON",
            homeAboutTitleLead: "What is",
            homeAboutTitleAccent: "El Niño?",
            homeNavHome: "Home",
            homeNavAbout: "About El Niño",
            homeNavIntelligence: "Intelligence",
            homeNavImpacts: "Climate Impacts",
            homeLogin: "Login",
            homeGetStarted: "Get Started",
            homeHeroEyebrow: "CLIMATE INTELLIGENCE PLATFORM",
            homeHeroLine1: "Understand Climate.",
            homeHeroLine2: "Anticipate Change.",
            homeHeroLine3: "Prepare for Tomorrow.",
            homeHeroDescription: "Explore El Niño patterns, analyze historical climate conditions, and understand potential impacts on rainfall, temperature, agriculture, and food prices through data-driven climate intelligence.",
            homeExplorePlatform: "Explore the Platform",
            homeDiscoverElNino: "Discover El Niño",
            homeHeroEvidence: "Evidence-based analysis",
            homeHeroDataDriven: "Data-driven insights",
            homeEnsoMonitor: "ENSO MONITOR",
            homeElNinoAnalysis: "El Niño Analysis",
            homeTrackOceanPatterns: "Track ocean-atmosphere patterns",
            homeAnalysisPlatform: "Analysis platform",
            homeClimateInsights: "CLIMATE INSIGHTS",
            homeRainfall: "Rainfall",
            homeTemperature: "Temperature",
            homeAgriculture: "Agriculture",
            homeInsightsDataNotice: "Insights depend on available data.",
            homeEnsoAnalysisTitle: "ENSO Analysis",
            homeUnderstandClimatePatterns: "Understand climate patterns",
            homeClimateTrendsTitle: "Climate Trends",
            homeExploreHistoricalObservations: "Explore historical observations",
            homeImpactAssessmentTitle: "Impact Assessment",
            homeInvestigateRegionalRisks: "Investigate regional risks",

            homeAboutIntro:
                "A recurring climate phenomenon in the tropical Pacific Ocean that can influence weather patterns across different parts of the world.",

            homeAboutOceanTitle: "Ocean Meets Atmosphere",
            homeAboutOceanDescription:
                "El Niño is the warm phase of the El Niño–Southern Oscillation (ENSO). It involves unusually warm sea-surface temperatures in parts of the central and eastern equatorial Pacific Ocean, alongside changes in atmospheric circulation.",
            homeAboutOceanLink: "Explore ENSO Analysis",

            homeAboutPatternsTitle: "Changing Climate Patterns",
            homeAboutPatternsDescription:
                "El Niño can influence rainfall, temperature, and seasonal weather patterns. Its effects vary by region, season, and the wider climate system.",

            homeAboutImportanceTitle: "Why It Matters",
            homeAboutImportanceDescription:
                "Understanding historical patterns can help researchers investigate potential drought risks, heat conditions, agricultural challenges, and other climate-related impacts.",

            workspace: "WORKSPACE",
            intelligence: "INTELLIGENCE",
            overview: "Overview",
            ensoAnalysis: "ENSO Analysis",
            climateAnalytics: "Climate Analytics",
            impactPrediction: "Impact Prediction",
            agriculture: "Agriculture",
            foodPriceForecast: "Food Price Forecast",
            historicalData: "Historical Data",
            reports: "Reports",
            signOut: "Sign out",

            climateInsights: "Climate insights",
            aboutPlatform: "About the platform",
            apiMonitoring: "API monitoring",

            chooseLanguage: "Choose language",
            chooseLocation: "Choose Location",
            search: "Search",
            useThisLocation: "Use This Location",
            selectedLocation: "Selected location",

            welcomeEyebrow: "CLIMATE INTELLIGENCE PLATFORM",
            welcomeTitle: "Understand the climate.",
            welcomeSubtitle: "Anticipate the impact.",
            exploreENSO: "Explore ENSO",
            historicalDataButton: "Historical data",

            systemOverview: "SYSTEM OVERVIEW",
            climateAtGlance: "Climate at a glance",
            awaitingData: "Awaiting data integration",

            ensoPhase: "ENSO PHASE",
            temperature: "TEMPERATURE",
            precipitation: "PRECIPITATION",
            regionalRisk: "REGIONAL RISK",

            latestENSO: "Latest ENSO classification",
            currentTemperature:
                "Current temperature at selected location",
            currentPrecipitation:
                "Current precipitation reading",
            locationRisk:
                "Location-specific climate risk",

            climateMonitoring: "CLIMATE MONITORING",
            climateTrendExplorer: "Climate trend explorer",
            historicalObservations:
                "Historical observations and climate variability",
            historicalSeries: "Historical series",
            climateDataUnavailable:
                "Climate data will appear here",
            exploreHistoricalData:
                "Explore historical data",

            pacificOcean: "PACIFIC OCEAN",
            ensoIntelligence: "ENSO intelligence",
            phaseUnavailable: "Phase not yet available",
            openENSOAnalysis: "Open ENSO analysis",

            yourWorkspace: "YOUR WORKSPACE",
            intelligenceModules: "Intelligence modules",
            chooseModule:
                "Choose a module to explore its analysis tools.",

            agricultureIntelligence:
                "Agriculture Intelligence",
            foodPrice: "Food Price Forecast",
            reportsInsights: "Reports & Insights",

            platformStatus: "PLATFORM STATUS",
            systemReadiness: "System readiness",
            dashboardInterface: "Dashboard interface",
            available: "Available",
            liveClimateObservations:
                "Live climate observations",
            predictionResults: "Prediction results",
            pending: "Pending",

            builtForClimateAwareness:
                "BUILT FOR CLIMATE AWARENESS",
            fromObservations:
                "From observations to insights.",
            discoverPlatform: "Discover the platform",

            languageEnglish: "English",
            languageTelugu: "Telugu",
            languageHindi: "Hindi",

            homeNavHome: "Home",
            homeNavAbout: "About El Niño",
            homeNavIntelligence: "Intelligence",
            homeNavImpacts: "Climate Impacts",
            homeLogin: "Login",
            homeGetStarted: "Get Started",

            homeEyebrow: "CLIMATE INTELLIGENCE PLATFORM",
            homeHeroLine1: "Understand Climate.",
            homeHeroLine2: "Anticipate Change.",
            homeHeroLine3: "Prepare for Tomorrow.",

            homeHeroDescription:
                "Explore El Niño patterns, analyze historical climate conditions, and understand potential impacts on rainfall, temperature, agriculture, and food prices through data-driven climate intelligence.",

            homeExplorePlatform: "Explore the Platform",
            homeDiscoverElNino: "Discover El Niño",
            // LOGIN PAGE
            loginPageTitle: "Login | El Niño AI",
            loginCreateAccount: "Create Account",
            loginPlatformLabel: "CLIMATE INTELLIGENCE PLATFORM",
            loginWelcome: "Welcome back to",
            loginDescription: "Sign in to explore climate patterns, historical observations, and regional climate intelligence.",
            loginFeature1: "Climate Analytics",
            loginFeature1Description: "Explore rainfall and temperature trends.",
            loginFeature2: "Impact Assessment",
            loginFeature2Description: "Investigate potential regional climate risks.",
            loginFeature3: "Evidence-Based Insights",
            loginFeature3Description: "Understand results using available data.",
            loginHeading: "Sign in",
            loginCardDescription: "Enter your account details to continue.",
            loginEmailLabel: "Email address",
            loginEmailPlaceholder: "you@example.com",
            loginPasswordLabel: "Password",
            loginPasswordPlaceholder: "Enter your password",
            loginShowPassword: "Show",
            loginHidePassword: "Hide",
            loginRememberMe: "Remember me",
            loginSubmit: "Sign In",
            loginNewToPlatform: "NEW TO EL NIÑO AI?",
            loginNoAccount: "Don't have an account?",
            loginCreateOne: "Create one",
            loginBackHome: "← Back to homepage",
            loginFooter: "El Niño AI. Climate intelligence for a changing world.",
            roniIndex: "RONI Index:",
            observation: "Observation:",
            episodeStatus: "Episode Status:",
            source: "Source:",
            loading: "Loading...",
            waitingNOAA: "Waiting for NOAA data",

            // REGISTER PAGE
            registerPageTitle: "Create Account | El Niño AI",
            registerSignIn: "Sign In",
            registerJoinLabel: "JOIN THE PLATFORM",
            registerBegin: "Begin your",
            registerJourney: "climate intelligence",
            registerDescription: "Create your account to explore historical climate observations, investigate ENSO patterns, and analyze potential regional impacts.",
            registerFeature1: "Explore Climate Data",
            registerFeature1Description: "Investigate historical rainfall and temperature.",
            registerFeature2: "Understand Regional Impacts",
            registerFeature2Description: "Explore climate-related risks using available evidence.",
            registerFeature3: "Discover AI Insights",
            registerFeature3Description: "Evaluate predictions with their limitations in mind.",
            registerHeading: "Create Account",
            registerCardDescription: "Enter your details to get started.",
            registerNameLabel: "Full name",
            registerNamePlaceholder: "Enter your full name",
            registerEmailLabel: "Email address",
            registerEmailPlaceholder: "you@example.com",
            registerPasswordLabel: "Password",
            registerPasswordPlaceholder: "Create a strong password",
            registerPasswordHint: "Use at least 8 characters.",
            registerConfirmPasswordLabel: "Confirm password",
            registerConfirmPasswordPlaceholder: "Enter your password again",
            registerTerms: "I agree to use this platform responsibly and understand that climate predictions may have limitations.",
            registerSubmit: "Create Account",
            registerAlreadyRegistered: "ALREADY REGISTERED?",
            registerHaveAccount: "Already have an account?",
            registerSignInLink: "Sign in",
            registerBackHome: "← Back to homepage",
            registerFooter: "El Niño AI. Climate intelligence for a changing world.",

            // Location map messages
            mapAuthRequired:
                "Please log in to manage locations.",
            mapLibraryFailed:
                "Map library could not load. Check your internet connection.",
            mapSearching:
                "Searching locations...",
            mapNoResults:
                "No locations found. Try another search.",
            mapResultsFound:
                "Locations found. Select one.",
            mapIdentifying:
                "Identifying selected location...",
            mapSelectedSave:
                "Location selected. Click Use This Location to save it.",
            mapSearchFailed:
                "Search failed. Check your internet connection and try again.",
            mapSaving:
                "Saving...",
            mapSaved:
                "Location saved successfully.",
            mapSaveFailed:
                "Unable to save this location.",
            mapSelectFirst:
                "Select a location first.",
            mapNoSelection:
                "No location selected yet.",

            locationSearchLabel:
                "Search location",
            locationSearchPlaceholder:
                "Enter a city, town or address...",
            mapSearchStart:
                "Search for a location to get started.",
            closeLocationMap:
                "Close location map",
            mapAttribution:
                "Map data © OpenStreetMap contributors",
            // Dashboard - Additional Weather Fields
            feelsLike: "FEELS LIKE",
            humidity: "HUMIDITY",
            windSpeed: "WIND SPEED",
            windDirection: "WIND DIRECTION",
            windGusts: "WIND GUSTS",
            airPressure: "AIR PRESSURE",
            cloudCover: "CLOUD COVER",
            uvIndex: "UV INDEX",

            currentFeelsLike: "Perceived temperature at selected location",
            currentHumidity: "Relative humidity in the air",
            currentWindSpeed: "Current wind speed",
            currentWindDirection: "Direction from which wind is blowing",
            currentWindGusts: "Maximum short-duration wind speed",
            currentAirPressure: "Mean sea-level atmospheric pressure",
            currentCloudCover: "Current cloud coverage",
            currentUVIndex: "Current ultraviolet radiation level",

            currentWeather: "Current weather",
            weatherObservation: "Weather observation",
            atmosphericCloudCoverage: "Atmospheric cloud coverage",
            solarRadiationIndicator: "Solar radiation indicator",

            observationRequired: "Observation required",
            notAssessed: "Not assessed",
            regionalRisk: "REGIONAL RISK",
            notAssessed: "Not assessed",
            locationRisk: "Location-specific climate risk",
            rainfallDeficit: "Rainfall deficit",
            temperatureAnomaly: "Temperature anomaly",
            historicalClimateAssessment: "Historical climate assessment",
            analyzingHistoricalClimate: "Analyzing historical climate data...",
            insufficientClimateData: "Insufficient historical climate data.",
            riskUnavailable: "Regional risk unavailable",
           

            // Additional Home Page translations
            homeBrandTagline: "CLIMATE INTELLIGENCE",
            homeIntelligenceEyebrow: "THE INTELLIGENCE FRAMEWORK",
            homeIntelligenceTitleLead: "Climate Data Into",
            homeIntelligenceTitleAccent: "Meaningful Insights.",
            homeIntelligenceIntro: "A unified platform designed to explore historical observations, investigate climate relationships, and evaluate potential future scenarios.",
            homeFeatureEnsoTitle: "El Niño Intelligence",
            homeFeatureEnsoDescription: "Explore ENSO indices, historical phases, and climate variations associated with El Niño and La Niña periods.",
            homeFeatureExploreAnalysis: "Explore analysis",
            homeFeatureClimateTitle: "Climate Analytics",
            homeFeatureClimateDescription: "Investigate historical rainfall and temperature trends through interactive charts and location-based comparisons.",
            homeFeatureAnalyzeClimate: "Analyze climate",
            homeFeatureImpactTitle: "Impact Prediction",
            homeFeatureImpactDescription: "Use appropriately evaluated machine learning models and historical evidence to assess potential climate-related risks.",
            homeFeatureExplorePredictions: "Explore predictions",
            homeFeatureAgricultureTitle: "Agriculture Insights",
            homeFeatureAgricultureDescription: "Investigate relationships between climate conditions, crop seasons, and available agricultural observations.",
            homeFeatureExploreAgriculture: "Explore agriculture",
            homeFeatureFoodPriceTitle: "Food Price Analysis",
            homeFeatureFoodPriceDescription: "Examine historical commodity prices, market arrivals, and possible relationships between climate conditions and food prices.",
            homeFeatureExploreMarkets: "Explore markets",
            homeFeatureHistoricalTitle: "Historical Climate Records",
            homeFeatureHistoricalDescription: "Compare available historical observations to identify trends, anomalies, and recurring climate patterns.",
            homeFeatureViewHistorical: "View historical data",
            homeImpactsEyebrow: "UNDERSTANDING THE IMPACT",
            homeImpactsTitleLead: "One Phenomenon.",
            homeImpactsTitleAccent: "Different Regional Effects.",
            homeImpactsIntro: "El Niño can influence climate conditions differently across the world. Understanding local historical observations is essential when evaluating potential risks and preparing for changing conditions.",
            homeImpactRainfallTitle: "Rainfall Variability",
            homeImpactRainfallDescription: "Investigate changes in rainfall patterns and seasonal precipitation.",
            homeImpactTemperatureTitle: "Temperature Changes",
            homeImpactTemperatureDescription: "Analyze historical temperature anomalies and potential heat-related conditions.",
            homeImpactAgricultureTitle: "Agriculture & Food Markets",
            homeImpactAgricultureDescription: "Examine how climate conditions may relate to crop production and commodity price movements.",
            homeExploreClimateImpacts: "Explore Climate Impacts",
            homeImpactVisualHeading: "CLIMATE INTELLIGENCE",
            homeDataDrivenLabel: "DATA-DRIVEN",
            homeImpactVisualElNino: "EL NIÑO",
            homeImpactVisualClimateAnalysis: "CLIMATE ANALYSIS",
            homeImpactNodeRainfall: "RAINFALL",
            homeImpactNodeHeat: "HEAT",
            homeImpactNodeAgriculture: "AGRICULTURE",
            homeImpactHistoricalEvidence: "Historical evidence",
            homeImpactRegionalContext: "Regional context",
            homeImpactRiskAssessment: "Risk assessment",
            homeCtaEyebrow: "BEGIN YOUR EXPLORATION",
            homeCtaTitleLead: "Make Climate Data",
            homeCtaTitleAccent: "More Meaningful.",
            homeCtaDescription: "Explore climate patterns, understand historical evidence, and investigate potential impacts through one unified platform.",
            homeCreateAccount: "Create Your Account",
            homeSignIn: "Sign In",
            homeFooterDescription: "Exploring climate patterns through data, scientific analysis, and machine learning.",
            homeFooterPlatform: "Platform",
            homeFooterElNinoAnalysis: "El Niño Analysis",
            homeFooterClimateAnalysis: "Climate Analysis",
            homeFooterImpactPrediction: "Impact Prediction",
            homeFooterHistoricalData: "Historical Data",
            homeFooterExplore: "Explore",
            homeFooterAgriculture: "Agriculture",
            homeFooterFoodPrices: "Food Prices",
            homeFooterReports: "Reports",
            homeFooterAboutProject: "About the Project",
            homeFooterAccount: "Your Account",
            homeFooterLogin: "Login",
            homeFooterCreateAccount: "Create Account",
            homeFooterCopyright: "El Niño AI. Climate intelligence for a changing world.",
            homeFooterDisclaimer: "Climate analysis is informational and depends on available data and model limitations.",
        },


        // =================================================
        // TELUGU
        // =================================================
        te: {
            // Home Page - About El Niño
            homeNavHome: "హోమ్",
            homeNavAbout: "ఎల్ నినో గురించి",
            homeNavIntelligence: "విశ్లేషణ",
            homeNavImpacts: "వాతావరణ ప్రభావాలు",
            homeLogin: "లాగిన్",
            homeGetStarted: "ప్రారంభించండి",
            homeAboutEyebrow: "ఈ వాతావరణ దృగ్విషయాన్ని అర్థం చేసుకోవడం",
            homeAboutTitleLead: "అంటే ఏమిటి",
            homeAboutTitleAccent: "El Niño?",
            homeHeroEyebrow: "వాతావరణ విశ్లేషణ వేదిక",
            homeHeroLine1: "వాతావరణాన్ని అర్థం చేసుకోండి.",
            homeHeroLine2: "మార్పును ముందుగానే అంచనా వేయండి.",
            homeHeroLine3: "రేపటి కోసం సిద్ధంగా ఉండండి.",
            homeHeroDescription: "ఎల్ నినో నమూనాలను పరిశీలించండి, చారిత్రక వాతావరణ పరిస్థితులను విశ్లేషించండి. వర్షపాతం, ఉష్ణోగ్రత, వ్యవసాయం మరియు ఆహార ధరలపై సంభావ్య ప్రభావాలను డేటా ఆధారిత విశ్లేషణ ద్వారా అర్థం చేసుకోండి.",
            homeExplorePlatform: "ప్లాట్‌ఫారమ్‌ను అన్వేషించండి",
            homeDiscoverElNino: "ఎల్ నినో గురించి తెలుసుకోండి",
            homeHeroEvidence: "ఆధారాలతో కూడిన విశ్లేషణ",
            homeHeroDataDriven: "డేటా ఆధారిత సమాచారం",
            homeEnsoMonitor: "ENSO పర్యవేక్షణ",
            homeElNinoAnalysis: "ఎల్ నినో విశ్లేషణ",
            homeTrackOceanPatterns: "సముద్రం మరియు వాతావరణ నమూనాలను పరిశీలించండి",
            homeAnalysisPlatform: "విశ్లేషణ వేదిక",
            homeClimateInsights: "వాతావరణ సమాచారం",
            homeRainfall: "వర్షపాతం",
            homeTemperature: "ఉష్ణోగ్రత",
            homeAgriculture: "వ్యవసాయం",
            homeInsightsDataNotice: "అందుబాటులో ఉన్న డేటాపై సమాచారం ఆధారపడి ఉంటుంది.",
            homeEnsoAnalysisTitle: "ENSO విశ్లేషణ",
            homeUnderstandClimatePatterns: "వాతావరణ నమూనాలను అర్థం చేసుకోండి",
            homeClimateTrendsTitle: "వాతావరణ ధోరణులు",
            homeExploreHistoricalObservations: "చారిత్రక పరిశీలనలను అన్వేషించండి",
            homeImpactAssessmentTitle: "ప్రభావాల అంచనా",
            homeInvestigateRegionalRisks: "ప్రాంతీయ ప్రమాదాలను పరిశీలించండి",

            homeAboutIntro:
                "ఉష్ణమండల పసిఫిక్ మహాసముద్రంలో సంభవించే ఈ వాతావరణ దృగ్విషయం ప్రపంచంలోని వివిధ ప్రాంతాల వాతావరణ పరిస్థితులను ప్రభావితం చేయగలదు.",

            homeAboutOceanTitle: "సముద్రం మరియు వాతావరణం",
            homeAboutOceanDescription:
                "El Niño అనేది ఎల్ నినో–సదరన్ ఆసిలేషన్ (ENSO) యొక్క ఉష్ణ దశ. ఇది మధ్య మరియు తూర్పు భూమధ్యరేఖ పసిఫిక్ మహాసముద్రంలోని కొన్ని ప్రాంతాల్లో సముద్ర ఉపరితల ఉష్ణోగ్రతలు అసాధారణంగా పెరగడం, వాతావరణ ప్రసరణలో మార్పులు చోటుచేసుకోవడం వంటి లక్షణాలను కలిగి ఉంటుంది.",
            homeAboutOceanLink: "ENSO విశ్లేషణను చూడండి",

            homeAboutPatternsTitle: "మారుతున్న వాతావరణ ధోరణులు",
                        homeAboutPatternsDescription:
                "El Niño వర్షపాతం, ఉష్ణోగ్రత మరియు కాలానుగుణ వాతావరణ ధోరణులను ప్రభావితం చేయగలదు. దీని ప్రభావాలు ప్రాంతం, ఋతువు మరియు ఇతర వాతావరణ పరిస్థితులపై ఆధారపడి మారుతాయి.",

            homeAboutImportanceTitle: "ఇది ఎందుకు ముఖ్యం?",
            homeAboutImportanceDescription:
                "చారిత్రక వాతావరణ ధోరణులను అర్థం చేసుకోవడం ద్వారా పరిశోధకులు కరువు ప్రమాదాలు, వేడి పరిస్థితులు, వ్యవసాయ సవాళ్లు మరియు ఇతర వాతావరణ సంబంధిత ప్రభావాలను పరిశీలించగలరు.",

            homeNavHome: "హోమ్",
            homeNavAbout: "ఎల్ నినో గురించి",
            homeNavIntelligence: "విశ్లేషణ",
            homeNavImpacts: "వాతావరణ ప్రభావాలు",
            homeLogin: "లాగిన్",
            homeGetStarted: "ప్రారంభించండి",

            homeEyebrow: "వాతావరణ విశ్లేషణ వేదిక",
            homeHeroLine1: "వాతావరణాన్ని అర్థం చేసుకోండి.",
            homeHeroLine2: "మార్పులను ముందుగానే అంచనా వేయండి.",
            homeHeroLine3: "రేపటి కోసం సిద్ధంగా ఉండండి.",

            homeHeroDescription:
                "ఎల్ నినో ధోరణులను పరిశీలించండి, చారిత్రక వాతావరణ పరిస్థితులను విశ్లేషించండి, అలాగే వర్షపాతం, ఉష్ణోగ్రత, వ్యవసాయం మరియు ఆహార ధరలపై సంభవించగల ప్రభావాలను డేటా ఆధారిత విశ్లేషణతో అర్థం చేసుకోండి.",

            homeExplorePlatform: "ప్లాట్‌ఫారమ్‌ను పరిశీలించండి",
            homeDiscoverElNino: "ఎల్ నినో గురించి తెలుసుకోండి",

            workspace: "వర్క్‌స్పేస్",
            intelligence: "ఇంటెలిజెన్స్",
            overview: "సారాంశం",
            ensoAnalysis: "ENSO విశ్లేషణ",
            climateAnalytics: "వాతావరణ విశ్లేషణ",
            impactPrediction: "ప్రభావ అంచనా",
            agriculture: "వ్యవసాయం",
            foodPriceForecast: "ఆహార ధరల అంచనా",
            historicalData: "చారిత్రక డేటా",
            reports: "నివేదికలు",
            signOut: "లాగ్ అవుట్",

            climateInsights: "వాతావరణ సమాచారం",
            aboutPlatform: "ప్లాట్‌ఫారమ్ గురించి",
            apiMonitoring: "API పర్యవేక్షణ",

            chooseLanguage: "భాషను ఎంచుకోండి",
            chooseLocation: "ప్రాంతాన్ని ఎంచుకోండి",
            search: "వెతకండి",
            useThisLocation: "ఈ ప్రాంతాన్ని ఉపయోగించండి",
            selectedLocation: "ఎంచుకున్న ప్రాంతం",

            welcomeEyebrow: "వాతావరణ విశ్లేషణ వేదిక",
            welcomeTitle: "వాతావరణాన్ని అర్థం చేసుకోండి.",
            welcomeSubtitle: "దాని ప్రభావాలను ముందుగానే అంచనా వేయండి.",
            exploreENSO: "ENSOను పరిశీలించండి",
            historicalDataButton: "చారిత్రక డేటా",

            systemOverview: "సిస్టమ్ సారాంశం",
            climateAtGlance: "వాతావరణ పరిస్థితులు",
            awaitingData: "డేటా కోసం వేచి ఉంది",

            ensoPhase: "ENSO దశ",
            temperature: "ఉష్ణోగ్రత",
            precipitation: "వర్షపాతం",
            regionalRisk: "ప్రాంతీయ ప్రమాదం",

            latestENSO: "తాజా ENSO వర్గీకరణ",
            currentTemperature:
                "ఎంచుకున్న ప్రాంతంలోని ప్రస్తుత ఉష్ణోగ్రత",
            currentPrecipitation: "ప్రస్తుత అవపాత నమోదు",
            locationRisk: "ప్రాంతానికి సంబంధించిన వాతావరణ ప్రమాదం",

            climateMonitoring: "వాతావరణ పర్యవేక్షణ",
            climateTrendExplorer: "వాతావరణ ధోరణుల పరిశీలన",
            historicalObservations:
                "చారిత్రక పరిశీలనలు మరియు వాతావరణ మార్పులు",
            historicalSeries: "చారిత్రక సమాచారం",
            climateDataUnavailable: "వాతావరణ డేటా ఇక్కడ కనిపిస్తుంది",
            exploreHistoricalData: "చారిత్రక డేటాను చూడండి",

            pacificOcean: "పసిఫిక్ మహాసముద్రం",
            ensoIntelligence: "ENSO సమాచారం",
            phaseUnavailable: "ENSO దశ ఇంకా అందుబాటులో లేదు",
            openENSOAnalysis: "ENSO విశ్లేషణను తెరవండి",

            yourWorkspace: "మీ వర్క్‌స్పేస్",
            intelligenceModules: "విశ్లేషణ విభాగాలు",
            chooseModule:
                "విశ్లేషణ సాధనాల కోసం ఒక విభాగాన్ని ఎంచుకోండి.",

            agricultureIntelligence: "వ్యవసాయ విశ్లేషణ",
            foodPrice: "ఆహార ధరల అంచనా",
            reportsInsights: "నివేదికలు మరియు విశ్లేషణలు",

            platformStatus: "ప్లాట్‌ఫారమ్ స్థితి",
            systemReadiness: "సిస్టమ్ సిద్ధస్థితి",
            dashboardInterface: "డాష్‌బోర్డ్ ఇంటర్‌ఫేస్",
            available: "అందుబాటులో ఉంది",
            liveClimateObservations: "ప్రస్తుత వాతావరణ పరిశీలనలు",
            predictionResults: "అంచనా ఫలితాలు",
            pending: "పెండింగ్‌లో ఉంది",

            builtForClimateAwareness:
                "వాతావరణ అవగాహన కోసం రూపొందించబడింది",
            fromObservations: "పరిశీలనల నుంచి విశ్లేషణల వరకు.",
            discoverPlatform: "ప్లాట్‌ఫారమ్ గురించి తెలుసుకోండి",

            languageEnglish: "ఇంగ్లీష్",
            languageTelugu: "తెలుగు",
            languageHindi: "హిందీ",
           roniIndex: "RONI సూచిక:",
            observation: "పరిశీలన కాలం:",
            episodeStatus: "ఎపిసోడ్ స్థితి:",
            source: "డేటా మూలం:",
            loading: "లోడ్ అవుతోంది...",
            waitingNOAA: "NOAA డేటా కోసం వేచి ఉంది",
            // LOGIN PAGE
            loginPageTitle: "లాగిన్ | El Niño AI",
            loginCreateAccount: "ఖాతాను సృష్టించండి",
            loginPlatformLabel: "వాతావరణ విశ్లేషణ వేదిక",
            loginWelcome: "తిరిగి స్వాగతం",
            loginDescription: "వాతావరణ నమూనాలు, చారిత్రక పరిశీలనలు మరియు ప్రాంతీయ వాతావరణ సమాచారాన్ని తెలుసుకోవడానికి లాగిన్ అవ్వండి.",
            loginFeature1: "వాతావరణ విశ్లేషణ",
            loginFeature1Description: "వర్షపాతం మరియు ఉష్ణోగ్రత ధోరణులను పరిశీలించండి.",
            loginFeature2: "ప్రభావాల అంచనా",
            loginFeature2Description: "ప్రాంతీయ వాతావరణ ప్రమాదాలను పరిశీలించండి.",
            loginFeature3: "ఆధారాలతో కూడిన సమాచారం",
            loginFeature3Description: "అందుబాటులో ఉన్న డేటా ఆధారంగా ఫలితాలను అర్థం చేసుకోండి.",
            loginHeading: "లాగిన్",
            loginCardDescription: "కొనసాగించడానికి మీ ఖాతా వివరాలను నమోదు చేయండి.",
            loginEmailLabel: "ఈమెయిల్ చిరునామా",
            loginEmailPlaceholder: "you@example.com",
            loginPasswordLabel: "పాస్‌వర్డ్",
            loginPasswordPlaceholder: "మీ పాస్‌వర్డ్ నమోదు చేయండి",
            loginShowPassword: "చూపించు",
            loginHidePassword: "దాచు",
            loginRememberMe: "నన్ను గుర్తుంచుకోండి",
            loginSubmit: "లాగిన్ అవ్వండి",
            loginNewToPlatform: "EL NIÑO AI కి కొత్తవారా?",
            loginNoAccount: "మీకు ఖాతా లేదా?",
            loginCreateOne: "ఖాతాను సృష్టించండి",
            loginBackHome: "← హోమ్‌పేజీకి తిరిగి వెళ్లండి",
            loginFooter: "El Niño AI. మారుతున్న ప్రపంచానికి వాతావరణ మేధస్సు.",

            // REGISTER PAGE
            registerPageTitle: "ఖాతాను సృష్టించండి | El Niño AI",
            registerSignIn: "లాగిన్",
            registerJoinLabel: "ప్లాట్‌ఫారమ్‌లో చేరండి",
            registerBegin: "మీ",
            registerJourney: "వాతావరణ విశ్లేషణ",
            registerDescription: "చారిత్రక వాతావరణ పరిశీలనలు, ENSO నమూనాలు మరియు ప్రాంతీయ ప్రభావాలను విశ్లేషించడానికి మీ ఖాతాను సృష్టించండి.",
            registerFeature1: "వాతావరణ డేటాను అన్వేషించండి",
            registerFeature1Description: "చారిత్రక వర్షపాతం మరియు ఉష్ణోగ్రతను పరిశీలించండి.",
            registerFeature2: "ప్రాంతీయ ప్రభావాలను అర్థం చేసుకోండి",
            registerFeature2Description: "అందుబాటులో ఉన్న ఆధారాలతో వాతావరణ ప్రమాదాలను పరిశీలించండి.",
            registerFeature3: "AI విశ్లేషణలను తెలుసుకోండి",
            registerFeature3Description: "AI అంచనాలను వాటి పరిమితులతో సహా అర్థం చేసుకోండి.",
            registerHeading: "ఖాతాను సృష్టించండి",
            registerCardDescription: "ప్రారంభించడానికి మీ వివరాలను నమోదు చేయండి.",
            registerNameLabel: "పూర్తి పేరు",
            registerNamePlaceholder: "మీ పూర్తి పేరు నమోదు చేయండి",
            registerEmailLabel: "ఈమెయిల్ చిరునామా",
            registerEmailPlaceholder: "you@example.com",
            registerPasswordLabel: "పాస్‌వర్డ్",
            registerPasswordPlaceholder: "బలమైన పాస్‌వర్డ్ సృష్టించండి",
            registerPasswordHint: "కనీసం 8 అక్షరాలు ఉపయోగించండి.",
            registerConfirmPasswordLabel: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
            registerConfirmPasswordPlaceholder: "మీ పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి",
            registerTerms: "ఈ ప్లాట్‌ఫారమ్‌ను బాధ్యతాయుతంగా ఉపయోగించడానికి అంగీకరిస్తున్నాను. వాతావరణ అంచనాలకు కొన్ని పరిమితులు ఉండవచ్చని అర్థం చేసుకున్నాను.",
            registerSubmit: "ఖాతాను సృష్టించండి",
            registerAlreadyRegistered: "ఇప్పటికే నమోదు చేసుకున్నారా?",
            registerHaveAccount: "మీకు ఇప్పటికే ఖాతా ఉందా?",
            registerSignInLink: "లాగిన్ అవ్వండి",
            registerBackHome: "← హోమ్‌పేజీకి తిరిగి వెళ్లండి",
            registerFooter: "El Niño AI. మారుతున్న ప్రపంచానికి వాతావరణ మేధస్సు.",

            // Location map messages
            mapAuthRequired:
                "ప్రాంతాలను నిర్వహించడానికి దయచేసి లాగిన్ అవ్వండి.",
            mapLibraryFailed:
                "మ్యాప్ లోడ్ కాలేదు. ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేయండి.",
            mapSearching: "ప్రాంతాల కోసం వెతుకుతోంది...",
            mapNoResults:
                "ప్రాంతాలు కనబడలేదు. మరో పేరు ప్రయత్నించండి.",
            mapResultsFound:
                "ప్రాంతాలు కనుగొనబడ్డాయి. ఒకదాన్ని ఎంచుకోండి.",
            mapIdentifying: "ఎంచుకున్న ప్రాంతాన్ని గుర్తిస్తోంది...",
            mapSelectedSave:
                "ప్రాంతం ఎంచుకున్నారు. సేవ్ చేయడానికి ఈ ప్రాంతాన్ని ఉపయోగించండి క్లిక్ చేయండి.",
            mapSearchFailed:
                "శోధన విఫలమైంది. ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.",
            mapSaving: "సేవ్ చేస్తోంది...",
            mapSaved: "ప్రాంతం విజయవంతంగా సేవ్ అయింది.",
            mapSaveFailed: "ఈ ప్రాంతాన్ని సేవ్ చేయలేకపోయింది.",
            mapSelectFirst: "ముందుగా ఒక ప్రాంతాన్ని ఎంచుకోండి.",
            mapNoSelection: "ఇంకా ఏ ప్రాంతమూ ఎంచుకోలేదు.",

            locationSearchLabel: "ప్రాంతాన్ని వెతకండి",
            locationSearchPlaceholder:
                "నగరం, పట్టణం లేదా చిరునామా నమోదు చేయండి...",
            mapSearchStart: "ప్రారంభించడానికి ఒక ప్రాంతాన్ని వెతకండి.",
            closeLocationMap: "మ్యాప్‌ను మూసివేయండి",
            mapAttribution:
                "మ్యాప్ డేటా © OpenStreetMap contributors",
            // Dashboard - Additional Weather Fields
            feelsLike: "అనుభూతి ఉష్ణోగ్రత",
            humidity: "తేమ",
            windSpeed: "గాలి వేగం",
            windDirection: "గాలి దిశ",
            windGusts: "గాలి ఉధృతి",
            airPressure: "వాయు పీడనం",
            cloudCover: "మేఘావరణం",
            uvIndex: "UV సూచిక",

            currentFeelsLike: "ఎంచుకున్న ప్రాంతంలో అనుభూతి చెందే ఉష్ణోగ్రత",
            currentHumidity: "గాలిలోని సాపేక్ష ఆర్ద్రత",
            currentWindSpeed: "ప్రస్తుత గాలి వేగం",
            currentWindDirection: "గాలి వీచే దిశ",
            currentWindGusts: "తక్కువ సమయంలో నమోదైన గరిష్ఠ గాలి వేగం",
            currentAirPressure: "సముద్ర మట్టానికి సంబంధించిన వాయు పీడనం",
            currentCloudCover: "ప్రస్తుత మేఘావరణం",
            currentUVIndex: "ప్రస్తుత అతినీలలోహిత కిరణాల స్థాయి",

            currentWeather: "ప్రస్తుత వాతావరణం",
            weatherObservation: "వాతావరణ పరిశీలన",
            atmosphericCloudCoverage: "వాతావరణంలోని మేఘాల కవరేజ్",
            solarRadiationIndicator: "సౌర వికిరణ సూచిక",

            observationRequired: "పరిశీలన అవసరం",
            notAssessed: "ఇంకా అంచనా వేయలేదు",
            regionalRisk: "ప్రాంతీయ ప్రమాదం",
            notAssessed: "ఇంకా అంచనా వేయలేదు",
            locationRisk: "ప్రాంతానికి సంబంధించిన వాతావరణ ప్రమాదం",
            rainfallDeficit: "వర్షపాతం లోటు",
            temperatureAnomaly: "ఉష్ణోగ్రత వ్యత్యాసం",
            historicalClimateAssessment: "చారిత్రక వాతావరణ విశ్లేషణ",
            analyzingHistoricalClimate: "చారిత్రక వాతావరణ డేటాను విశ్లేషిస్తోంది...",
            insufficientClimateData: "తగినంత చారిత్రక వాతావరణ డేటా లేదు",
            riskUnavailable: "ప్రాంతీయ ప్రమాద సమాచారం అందుబాటులో లేదు",    

            // Additional Home Page translations
            homeBrandTagline: "వాతావరణ మేధస్సు",
            homeIntelligenceEyebrow: "విశ్లేషణ వ్యవస్థ",
            homeIntelligenceTitleLead: "వాతావరణ డేటా నుంచి",
            homeIntelligenceTitleAccent: "అర్థవంతమైన అవగాహనలు.",
            homeIntelligenceIntro:
                "గత పరిశీలనలను అన్వేషించడానికి, వాతావరణ సంబంధాలను పరిశీలించడానికి మరియు భవిష్యత్తులో సంభవించగల పరిస్థితులను అంచనా వేయడానికి రూపొందించిన సమగ్ర వేదిక.",

            homeFeatureEnsoTitle: "ఎల్ నినో విశ్లేషణ",
            homeFeatureEnsoDescription:
                "ENSO సూచికలు, గత దశలు మరియు ఎల్ నినో, లా నినా కాలాలకు సంబంధించిన వాతావరణ మార్పులను పరిశీలించండి.",
            homeFeatureExploreAnalysis: "విశ్లేషణను చూడండి",

            homeFeatureClimateTitle: "వాతావరణ విశ్లేషణ",
            homeFeatureClimateDescription:
                "ఇంటరాక్టివ్ చార్ట్‌లు మరియు ప్రాంతాల వారీ పోలికల ద్వారా గత వర్షపాతం, ఉష్ణోగ్రత ధోరణులను పరిశీలించండి.",
            homeFeatureAnalyzeClimate: "వాతావరణాన్ని విశ్లేషించండి",

            homeFeatureImpactTitle: "ప్రభావాల అంచనా",
            homeFeatureImpactDescription:
                "సరైన రీతిలో మూల్యాంకనం చేసిన మెషిన్ లెర్నింగ్ మోడళ్లు మరియు చారిత్రక ఆధారాలను ఉపయోగించి వాతావరణ సంబంధిత ప్రమాదాలను అంచనా వేయండి.",
            homeFeatureExplorePredictions: "అంచనాలను చూడండి",

            homeFeatureAgricultureTitle: "వ్యవసాయ అవగాహనలు",
            homeFeatureAgricultureDescription:
                "వాతావరణ పరిస్థితులు, పంటల సీజన్లు మరియు అందుబాటులో ఉన్న వ్యవసాయ పరిశీలనల మధ్య సంబంధాలను పరిశీలించండి.",
            homeFeatureExploreAgriculture: "వ్యవసాయ వివరాలు చూడండి",

            homeFeatureFoodPriceTitle: "ఆహార ధరల విశ్లేషణ",
            homeFeatureFoodPriceDescription:
                "గత సరుకు ధరలు, మార్కెట్‌కు వచ్చిన సరుకుల వివరాలు మరియు వాతావరణ పరిస్థితులు, ఆహార ధరల మధ్య ఉండే అవకాశమైన సంబంధాలను పరిశీలించండి.",
            homeFeatureExploreMarkets: "మార్కెట్ వివరాలు చూడండి",

            homeFeatureHistoricalTitle: "చారిత్రక వాతావరణ రికార్డులు",
            homeFeatureHistoricalDescription:
                "ధోరణులు, అసాధారణ మార్పులు మరియు పునరావృతమయ్యే వాతావరణ నమూనాలను గుర్తించడానికి అందుబాటులో ఉన్న గత పరిశీలనలను పోల్చండి.",
            homeFeatureViewHistorical: "చారిత్రక డేటాను చూడండి",

            homeImpactsEyebrow: "ప్రభావాలను అర్థం చేసుకోవడం",
            homeImpactsTitleLead: "ఒకే వాతావరణ పరిణామం.",
            homeImpactsTitleAccent: "ప్రాంతాన్ని బట్టి వేర్వేరు ప్రభావాలు.",
            homeImpactsIntro:
                "ఎల్ నినో ప్రపంచంలోని వివిధ ప్రాంతాల్లో వాతావరణ పరిస్థితులను భిన్నంగా ప్రభావితం చేయగలదు. సంభావ్య ప్రమాదాలను అంచనా వేయడానికి, మారుతున్న పరిస్థితులకు సిద్ధం కావడానికి స్థానిక చారిత్రక పరిశీలనలను అర్థం చేసుకోవడం అవసరం.",

            homeImpactRainfallTitle: "వర్షపాతంలో మార్పులు",
            homeImpactRainfallDescription:
                "వర్షపాత నమూనాలు మరియు ఋతుపరమైన వర్షాల్లో వచ్చే మార్పులను పరిశీలించండి.",
            homeImpactTemperatureTitle: "ఉష్ణోగ్రత మార్పులు",
            homeImpactTemperatureDescription:
                "గత ఉష్ణోగ్రత అసాధారణ మార్పులు మరియు అధిక వేడికి సంబంధించిన పరిస్థితులను విశ్లేషించండి.",
            homeImpactAgricultureTitle: "వ్యవసాయం మరియు ఆహార మార్కెట్లు",
            homeImpactAgricultureDescription:
                "వాతావరణ పరిస్థితులు పంటల ఉత్పత్తి మరియు సరుకుల ధరల మార్పులతో ఎలా సంబంధం కలిగి ఉండవచ్చో పరిశీలించండి.",

            homeExploreClimateImpacts: "వాతావరణ ప్రభావాలను పరిశీలించండి",
            homeImpactVisualHeading: "వాతావరణ మేధస్సు",
            homeDataDrivenLabel: "డేటా ఆధారితం",
            homeImpactVisualElNino: "ఎల్ నినో",
            homeImpactVisualClimateAnalysis: "వాతావరణ విశ్లేషణ",
            homeImpactNodeRainfall: "వర్షపాతం",
            homeImpactNodeHeat: "వేడి",
            homeImpactNodeAgriculture: "వ్యవసాయం",
            homeImpactHistoricalEvidence: "చారిత్రక ఆధారాలు",
            homeImpactRegionalContext: "ప్రాంతీయ పరిస్థితులు",
            homeImpactRiskAssessment: "ప్రమాదాల అంచనా",

            homeCtaEyebrow: "మీ అన్వేషణను ప్రారంభించండి",
            homeCtaTitleLead: "వాతావరణ డేటాను",
            homeCtaTitleAccent: "మరింత అర్థవంతంగా మార్చండి.",
            homeCtaDescription:
                "ఒకే సమగ్ర వేదిక ద్వారా వాతావరణ నమూనాలను అన్వేషించండి, చారిత్రక ఆధారాలను అర్థం చేసుకోండి మరియు సంభావ్య ప్రభావాలను పరిశీలించండి.",

            homeCreateAccount: "మీ ఖాతాను సృష్టించండి",
            homeSignIn: "సైన్ ఇన్",

            homeFooterDescription:
                "డేటా, శాస్త్రీయ విశ్లేషణ మరియు మెషిన్ లెర్నింగ్ ద్వారా వాతావరణ నమూనాలను పరిశీలించడం.",
            homeFooterPlatform: "ప్లాట్‌ఫారమ్",
            homeFooterElNinoAnalysis: "ఎల్ నినో విశ్లేషణ",
            homeFooterClimateAnalysis: "వాతావరణ విశ్లేషణ",
            homeFooterImpactPrediction: "ప్రభావాల అంచనా",
            homeFooterHistoricalData: "చారిత్రక డేటా",
            homeFooterExplore: "అన్వేషించండి",
            homeFooterAgriculture: "వ్యవసాయం",
            homeFooterFoodPrices: "ఆహార ధరలు",
            homeFooterReports: "నివేదికలు",
            homeFooterAboutProject: "ప్రాజెక్ట్ గురించి",
            homeFooterAccount: "మీ ఖాతా",
            homeFooterLogin: "లాగిన్",
            homeFooterCreateAccount: "ఖాతాను సృష్టించండి",
            homeFooterCopyright:
                "El Niño AI. మారుతున్న ప్రపంచానికి వాతావరణ మేధస్సు.",
            homeFooterDisclaimer:
                "వాతావరణ విశ్లేషణ సమాచారం కోసం మాత్రమే. ఇది అందుబాటులో ఉన్న డేటా మరియు మోడళ్ల పరిమితులపై ఆధారపడి ఉంటుంది."
        },

        // =================================================
        // HINDI
        // =================================================
        hi: {
            // Hindi dictionary continues in Part 3
                        homeNavHome: "होम",
            homeNavAbout: "एल नीनो के बारे में",
            homeNavIntelligence: "विश्लेषण",
            homeNavImpacts: "जलवायु प्रभाव",
            homeLogin: "लॉगिन",
            homeGetStarted: "शुरू करें",

            homeAboutEyebrow: "इस जलवायु घटना को समझें",
            homeAboutTitleLead: "क्या है",
            homeAboutTitleAccent: "El Niño?",

            homeHeroEyebrow: "जलवायु इंटेलिजेंस प्लेटफॉर्म",
            homeHeroLine1: "जलवायु को समझें।",
            homeHeroLine2: "बदलाव का अनुमान लगाएं।",
            homeHeroLine3: "कल के लिए तैयार रहें।",

            homeHeroDescription:
                "एल नीनो पैटर्न का अध्ययन करें, ऐतिहासिक जलवायु परिस्थितियों का विश्लेषण करें और वर्षा, तापमान, कृषि तथा खाद्य कीमतों पर संभावित प्रभावों को डेटा-आधारित विश्लेषण के माध्यम से समझें।",

            homeExplorePlatform: "प्लेटफॉर्म देखें",
            homeDiscoverElNino: "एल नीनो के बारे में जानें",

            homeHeroEvidence: "साक्ष्य-आधारित विश्लेषण",
            homeHeroDataDriven: "डेटा-आधारित जानकारी",
            homeEnsoMonitor: "ENSO निगरानी",
            homeElNinoAnalysis: "एल नीनो विश्लेषण",
            homeTrackOceanPatterns: "समुद्र और वायुमंडल के पैटर्न देखें",
            homeAnalysisPlatform: "विश्लेषण प्लेटफॉर्म",
            homeClimateInsights: "जलवायु जानकारी",
            homeRainfall: "वर्षा",
            homeTemperature: "तापमान",
            homeAgriculture: "कृषि",
            homeInsightsDataNotice:
                "जानकारी उपलब्ध डेटा पर निर्भर करती है।",

            homeEnsoAnalysisTitle: "ENSO विश्लेषण",
            homeUnderstandClimatePatterns:
                "जलवायु पैटर्न को समझें",
            homeClimateTrendsTitle: "जलवायु रुझान",
            homeExploreHistoricalObservations:
                "ऐतिहासिक अवलोकनों का अध्ययन करें",
            homeImpactAssessmentTitle: "प्रभाव का आकलन",
            homeInvestigateRegionalRisks:
                "क्षेत्रीय जोखिमों का अध्ययन करें",

            homeAboutIntro:
                "उष्णकटिबंधीय प्रशांत महासागर में होने वाली यह जलवायु घटना दुनिया के विभिन्न हिस्सों में मौसम के पैटर्न को प्रभावित कर सकती है।",

            homeAboutOceanTitle: "महासागर और वायुमंडल",
            homeAboutOceanDescription:
                "एल नीनो, El Niño–Southern Oscillation (ENSO) का गर्म चरण है। इसमें मध्य और पूर्वी भूमध्यरेखीय प्रशांत महासागर के कुछ हिस्सों में समुद्र की सतह का तापमान असामान्य रूप से बढ़ जाता है और वायुमंडलीय परिसंचरण में बदलाव होते हैं।",
            homeAboutOceanLink: "ENSO विश्लेषण देखें",

            homeAboutPatternsTitle:
                "बदलते जलवायु पैटर्न",
            homeAboutPatternsDescription:
                "एल नीनो वर्षा, तापमान और मौसमी मौसम पैटर्न को प्रभावित कर सकता है। इसके प्रभाव क्षेत्र, मौसम और व्यापक जलवायु प्रणाली के अनुसार अलग-अलग होते हैं।",

            homeAboutImportanceTitle: "यह क्यों महत्वपूर्ण है?",
            homeAboutImportanceDescription:
                "ऐतिहासिक पैटर्न को समझने से शोधकर्ताओं को सूखे के जोखिम, गर्मी की स्थिति, कृषि चुनौतियों और अन्य जलवायु-संबंधित प्रभावों का अध्ययन करने में मदद मिलती है।",

            workspace: "वर्कस्पेस",
            intelligence: "इंटेलिजेंस",
            overview: "अवलोकन",
            ensoAnalysis: "ENSO विश्लेषण",
            climateAnalytics: "जलवायु विश्लेषण",
            impactPrediction: "प्रभाव का अनुमान",
            agriculture: "कृषि",
            foodPriceForecast: "खाद्य मूल्य पूर्वानुमान",
            historicalData: "ऐतिहासिक डेटा",
            reports: "रिपोर्ट",
            signOut: "लॉग आउट",

            climateInsights: "जलवायु जानकारी",
            aboutPlatform: "प्लेटफॉर्म के बारे में",
            apiMonitoring: "API निगरानी",

            chooseLanguage: "भाषा चुनें",
            chooseLocation: "स्थान चुनें",
            search: "खोजें",
            useThisLocation: "इस स्थान का उपयोग करें",
            selectedLocation: "चुना गया स्थान",

            welcomeEyebrow: "जलवायु इंटेलिजेंस प्लेटफॉर्म",
            welcomeTitle: "जलवायु को समझें।",
            welcomeSubtitle: "प्रभावों का अनुमान लगाएं।",
            exploreENSO: "ENSO देखें",
            historicalDataButton: "ऐतिहासिक डेटा",

            systemOverview: "सिस्टम अवलोकन",
            climateAtGlance: "जलवायु की एक झलक",
            awaitingData: "डेटा की प्रतीक्षा है",

            ensoPhase: "ENSO चरण",
            temperature: "तापमान",
            precipitation: "वर्षा",
            regionalRisk: "क्षेत्रीय जोखिम",

            latestENSO: "नवीनतम ENSO वर्गीकरण",
            currentTemperature:
                "चुने गए स्थान का वर्तमान तापमान",
            currentPrecipitation:
                "वर्तमान वर्षा रीडिंग",
            locationRisk:
                "स्थान-विशिष्ट जलवायु जोखिम",

            climateMonitoring: "जलवायु निगरानी",
            climateTrendExplorer: "जलवायु रुझान विश्लेषण",
            historicalObservations:
                "ऐतिहासिक अवलोकन और जलवायु परिवर्तनशीलता",
            historicalSeries: "ऐतिहासिक डेटा श्रृंखला",
            climateDataUnavailable:
                "जलवायु डेटा यहां दिखाई देगा",
            exploreHistoricalData:
                "ऐतिहासिक डेटा देखें",

            pacificOcean: "प्रशांत महासागर",
            ensoIntelligence: "ENSO इंटेलिजेंस",
            phaseUnavailable:
                "चरण अभी उपलब्ध नहीं है",
            openENSOAnalysis: "ENSO विश्लेषण खोलें",

            yourWorkspace: "आपका वर्कस्पेस",
            intelligenceModules: "विश्लेषण मॉड्यूल",
            chooseModule:
                "विश्लेषण टूल देखने के लिए एक मॉड्यूल चुनें।",

            agricultureIntelligence:
                "कृषि विश्लेषण",
            foodPrice: "खाद्य मूल्य पूर्वानुमान",
            reportsInsights: "रिपोर्ट और जानकारी",

            platformStatus: "प्लेटफॉर्म स्थिति",
            systemReadiness: "सिस्टम की तैयारी",
            dashboardInterface: "डैशबोर्ड इंटरफेस",
            available: "उपलब्ध",
            liveClimateObservations:
                "वर्तमान जलवायु अवलोकन",
            predictionResults: "पूर्वानुमान परिणाम",
            pending: "लंबित",

            builtForClimateAwareness:
                "जलवायु जागरूकता के लिए बनाया गया",
            fromObservations:
                "अवलोकनों से उपयोगी जानकारी तक।",
            discoverPlatform: "प्लेटफॉर्म के बारे में जानें",

            languageEnglish: "अंग्रेज़ी",
            languageTelugu: "तेलुगु",
            languageHindi: "हिंदी",
            // LOGIN PAGE
            loginPageTitle: "लॉगिन | El Niño AI",
            loginCreateAccount: "खाता बनाएं",
            loginPlatformLabel: "जलवायु इंटेलिजेंस प्लेटफॉर्म",
            loginWelcome: "वापस स्वागत है",
            loginDescription: "जलवायु पैटर्न, ऐतिहासिक अवलोकनों और क्षेत्रीय जलवायु जानकारी का अध्ययन करने के लिए लॉगिन करें।",
            loginFeature1: "जलवायु विश्लेषण",
            loginFeature1Description: "वर्षा और तापमान के रुझानों का अध्ययन करें।",
            loginFeature2: "प्रभाव का आकलन",
            loginFeature2Description: "संभावित क्षेत्रीय जलवायु जोखिमों की जांच करें।",
            loginFeature3: "साक्ष्य-आधारित जानकारी",
            loginFeature3Description: "उपलब्ध डेटा के आधार पर परिणामों को समझें।",
            loginHeading: "लॉगिन करें",
            loginCardDescription: "जारी रखने के लिए अपने खाते का विवरण दर्ज करें।",
            loginEmailLabel: "ईमेल पता",
            loginEmailPlaceholder: "you@example.com",
            loginPasswordLabel: "पासवर्ड",
            loginPasswordPlaceholder: "अपना पासवर्ड दर्ज करें",
            loginShowPassword: "दिखाएं",
            loginHidePassword: "छिपाएं",
            loginRememberMe: "मुझे याद रखें",
            loginSubmit: "साइन इन",
            loginNewToPlatform: "EL NIÑO AI पर नए हैं?",
            loginNoAccount: "क्या आपका खाता नहीं है?",
            loginCreateOne: "खाता बनाएं",
            loginBackHome: "← होमपेज पर वापस जाएं",
            loginFooter: "El Niño AI. बदलती दुनिया के लिए जलवायु इंटेलिजेंस।",

            // REGISTER PAGE
            registerPageTitle: "खाता बनाएं | El Niño AI",
            registerSignIn: "साइन इन",
            registerJoinLabel: "प्लेटफॉर्म से जुड़ें",
            registerBegin: "अपनी",
            registerJourney: "जलवायु इंटेलिजेंस",
            registerDescription: "ऐतिहासिक जलवायु अवलोकनों, ENSO पैटर्न और संभावित क्षेत्रीय प्रभावों का विश्लेषण करने के लिए अपना खाता बनाएं।",
            registerFeature1: "जलवायु डेटा का अध्ययन करें",
            registerFeature1Description: "ऐतिहासिक वर्षा और तापमान की जांच करें।",
            registerFeature2: "क्षेत्रीय प्रभावों को समझें",
            registerFeature2Description: "उपलब्ध साक्ष्यों के आधार पर जलवायु जोखिमों का अध्ययन करें।",
            registerFeature3: "AI जानकारी खोजें",
            registerFeature3Description: "पूर्वानुमानों और उनकी सीमाओं को समझें।",
            registerHeading: "खाता बनाएं",
            registerCardDescription: "शुरू करने के लिए अपना विवरण दर्ज करें।",
            registerNameLabel: "पूरा नाम",
            registerNamePlaceholder: "अपना पूरा नाम दर्ज करें",
            registerEmailLabel: "ईमेल पता",
            registerEmailPlaceholder: "you@example.com",
            registerPasswordLabel: "पासवर्ड",
            registerPasswordPlaceholder: "एक मजबूत पासवर्ड बनाएं",
            registerPasswordHint: "कम से कम 8 अक्षरों का उपयोग करें।",
            registerConfirmPasswordLabel: "पासवर्ड की पुष्टि करें",
            registerConfirmPasswordPlaceholder: "अपना पासवर्ड दोबारा दर्ज करें",
            registerTerms: "मैं इस प्लेटफॉर्म का जिम्मेदारी से उपयोग करने के लिए सहमत हूं और समझता हूं कि जलवायु पूर्वानुमानों की कुछ सीमाएं हो सकती हैं।",
            registerSubmit: "खाता बनाएं",
            registerAlreadyRegistered: "पहले से पंजीकृत हैं?",
            registerHaveAccount: "क्या आपका पहले से खाता है?",
            registerSignInLink: "साइन इन करें",
            registerBackHome: "← होमपेज पर वापस जाएं",
            registerFooter: "El Niño AI. बदलती दुनिया के लिए जलवायु इंटेलिजेंस।",

            // Location map messages
            mapAuthRequired:
                "स्थान प्रबंधित करने के लिए कृपया लॉगिन करें।",
            mapLibraryFailed:
                "मैप लोड नहीं हो पाया। अपना इंटरनेट कनेक्शन जांचें।",
            mapSearching: "स्थान खोजे जा रहे हैं...",
            mapNoResults:
                "कोई स्थान नहीं मिला। दूसरी खोज करें।",
            mapResultsFound:
                "स्थान मिल गए। एक स्थान चुनें।",
            mapIdentifying:
                "चुने गए स्थान की पहचान की जा रही है...",
            mapSelectedSave:
                "स्थान चुना गया। इसे सेव करने के लिए इस स्थान का उपयोग करें पर क्लिक करें।",
            mapSearchFailed:
                "खोज विफल रही। इंटरनेट कनेक्शन जांचें और फिर प्रयास करें।",
            mapSaving: "सेव किया जा रहा है...",
            mapSaved: "स्थान सफलतापूर्वक सेव हो गया।",
            mapSaveFailed:
                "इस स्थान को सेव नहीं किया जा सका।",
            mapSelectFirst:
                "कृपया पहले एक स्थान चुनें।",
            mapNoSelection:
                "अभी तक कोई स्थान नहीं चुना गया है।",

            locationSearchLabel: "स्थान खोजें",
            locationSearchPlaceholder:
                "शहर, कस्बा या पता दर्ज करें...",
            mapSearchStart:
                "शुरू करने के लिए किसी स्थान को खोजें।",
            closeLocationMap: "मैप बंद करें",
            mapAttribution:
            "मैप डेटा © OpenStreetMap contributors",
            regionalRisk: "क्षेत्रीय जोखिम",
            notAssessed: "अभी तक आकलन नहीं किया गया",
            locationRisk: "स्थान-विशिष्ट जलवायु जोखिम",
            rainfallDeficit: "वर्षा में कमी",
            temperatureAnomaly: "तापमान में विचलन",
            historicalClimateAssessment: "ऐतिहासिक जलवायु आकलन",
            analyzingHistoricalClimate: "ऐतिहासिक जलवायु डेटा का विश्लेषण किया जा रहा है...",
            insufficientClimateData: "पर्याप्त ऐतिहासिक जलवायु डेटा उपलब्ध नहीं है",
            riskUnavailable: "क्षेत्रीय जोखिम की जानकारी उपलब्ध नहीं है",
            roniIndex: "RONI सूचकांक:",
            observation: "अवलोकन अवधि:",
            episodeStatus: "एपिसोड की स्थिति:",
            source: "डेटा स्रोत:",
            loading: "लोड हो रहा है...",
            waitingNOAA: "NOAA डेटा की प्रतीक्षा है",    

            // Dashboard - Additional Weather Fields
            feelsLike: "महसूस होने वाला तापमान",
            humidity: "आर्द्रता",
            windSpeed: "हवा की गति",
            windDirection: "हवा की दिशा",
            windGusts: "हवा के तेज झोंके",
            airPressure: "वायुदाब",
            cloudCover: "बादलों का आवरण",
            uvIndex: "UV सूचकांक",

            currentFeelsLike: "चुने गए स्थान पर महसूस होने वाला तापमान",
            currentHumidity: "हवा में सापेक्ष आर्द्रता",
            currentWindSpeed: "वर्तमान हवा की गति",
            currentWindDirection: "हवा की दिशा",
            currentWindGusts: "कम समय में हवा की अधिकतम गति",
            currentAirPressure: "समुद्र तल के सापेक्ष वायुदाब",
            currentCloudCover: "वर्तमान बादलों का आवरण",
            currentUVIndex: "वर्तमान पराबैंगनी विकिरण का स्तर",

            currentWeather: "वर्तमान मौसम",
            weatherObservation: "मौसम अवलोकन",
            atmosphericCloudCoverage: "वायुमंडलीय बादल आवरण",
            solarRadiationIndicator: "सौर विकिरण संकेतक",

            observationRequired: "अवलोकन आवश्यक है",
            notAssessed: "अभी आकलन नहीं किया गया",    
            // Additional Home Page translations
            homeBrandTagline: "जलवायु इंटेलिजेंस",
            homeIntelligenceEyebrow: "इंटेलिजेंस फ्रेमवर्क",
            homeIntelligenceTitleLead: "जलवायु डेटा से",
            homeIntelligenceTitleAccent:
                "अर्थपूर्ण जानकारी।",
            homeIntelligenceIntro:
                "ऐतिहासिक अवलोकनों का अध्ययन करने, जलवायु संबंधों की जांच करने और संभावित भविष्य के परिदृश्यों का मूल्यांकन करने के लिए एक एकीकृत प्लेटफॉर्म।",

            homeFeatureEnsoTitle: "एल नीनो इंटेलिजेंस",
            homeFeatureEnsoDescription:
                "ENSO सूचकांकों, ऐतिहासिक चरणों और एल नीनो तथा ला नीना अवधियों से जुड़े जलवायु परिवर्तनों का अध्ययन करें।",
            homeFeatureExploreAnalysis: "विश्लेषण देखें",

            homeFeatureClimateTitle: "जलवायु विश्लेषण",
            homeFeatureClimateDescription:
                "इंटरैक्टिव चार्ट और स्थान-आधारित तुलना के माध्यम से ऐतिहासिक वर्षा और तापमान के रुझानों का अध्ययन करें।",
            homeFeatureAnalyzeClimate: "जलवायु विश्लेषण करें",

            homeFeatureImpactTitle: "प्रभाव का पूर्वानुमान",
            homeFeatureImpactDescription:
                "संभावित जलवायु-संबंधित जोखिमों का आकलन करने के लिए मूल्यांकन किए गए मशीन लर्निंग मॉडल और ऐतिहासिक साक्ष्यों का उपयोग करें।",
            homeFeatureExplorePredictions: "पूर्वानुमान देखें",

            homeFeatureAgricultureTitle: "कृषि संबंधी जानकारी",
            homeFeatureAgricultureDescription:
                "जलवायु परिस्थितियों, फसल के मौसम और उपलब्ध कृषि अवलोकनों के बीच संबंधों का अध्ययन करें।",
            homeFeatureExploreAgriculture: "कृषि जानकारी देखें",

            homeFeatureFoodPriceTitle: "खाद्य मूल्य विश्लेषण",
            homeFeatureFoodPriceDescription:
                "ऐतिहासिक वस्तु कीमतों, बाजार में आवक और जलवायु परिस्थितियों तथा खाद्य कीमतों के बीच संभावित संबंधों का अध्ययन करें।",
            homeFeatureExploreMarkets: "बाजार देखें",

            homeFeatureHistoricalTitle:
                "ऐतिहासिक जलवायु रिकॉर्ड",
            homeFeatureHistoricalDescription:
                "रुझानों, असामान्य बदलावों और बार-बार होने वाले जलवायु पैटर्न की पहचान करने के लिए उपलब्ध ऐतिहासिक अवलोकनों की तुलना करें।",
            homeFeatureViewHistorical: "ऐतिहासिक डेटा देखें",

            homeImpactsEyebrow: "प्रभावों को समझें",
            homeImpactsTitleLead: "एक घटना।",
            homeImpactsTitleAccent:
                "अलग-अलग क्षेत्रीय प्रभाव।",
            homeImpactsIntro:
                "एल नीनो दुनिया के विभिन्न क्षेत्रों में जलवायु परिस्थितियों को अलग-अलग तरीके से प्रभावित कर सकता है। संभावित जोखिमों का मूल्यांकन करने और बदलती परिस्थितियों के लिए तैयार रहने हेतु स्थानीय ऐतिहासिक अवलोकनों को समझना आवश्यक है।",

            homeImpactRainfallTitle: "वर्षा में बदलाव",
            homeImpactRainfallDescription:
                "वर्षा पैटर्न और मौसमी वर्षा में होने वाले बदलावों का अध्ययन करें।",

            homeImpactTemperatureTitle: "तापमान में बदलाव",
            homeImpactTemperatureDescription:
                "ऐतिहासिक तापमान विसंगतियों और संभावित गर्मी-संबंधी परिस्थितियों का विश्लेषण करें।",

            homeImpactAgricultureTitle:
                "कृषि और खाद्य बाजार",
            homeImpactAgricultureDescription:
                "जलवायु परिस्थितियों और फसल उत्पादन तथा वस्तुओं की कीमतों में होने वाले बदलावों के बीच संभावित संबंधों का अध्ययन करें।",

            homeExploreClimateImpacts:
                "जलवायु प्रभाव देखें",
            homeImpactVisualHeading: "जलवायु इंटेलिजेंस",
            homeDataDrivenLabel: "डेटा-आधारित",
            homeImpactVisualElNino: "एल नीनो",
            homeImpactVisualClimateAnalysis:
                "जलवायु विश्लेषण",
            homeImpactNodeRainfall: "वर्षा",
            homeImpactNodeHeat: "गर्मी",
            homeImpactNodeAgriculture: "कृषि",
            homeImpactHistoricalEvidence:
                "ऐतिहासिक साक्ष्य",
            homeImpactRegionalContext:
                "क्षेत्रीय संदर्भ",
            homeImpactRiskAssessment:
                "जोखिम का आकलन",

            homeCtaEyebrow: "अपनी खोज शुरू करें",
            homeCtaTitleLead: "जलवायु डेटा को",
            homeCtaTitleAccent:
                "और अधिक अर्थपूर्ण बनाएं।",
            homeCtaDescription:
                "एक एकीकृत प्लेटफॉर्म के माध्यम से जलवायु पैटर्न का अध्ययन करें, ऐतिहासिक साक्ष्यों को समझें और संभावित प्रभावों की जांच करें।",

            homeCreateAccount: "अपना खाता बनाएं",
            homeSignIn: "साइन इन",

            homeFooterDescription:
                "डेटा, वैज्ञानिक विश्लेषण और मशीन लर्निंग के माध्यम से जलवायु पैटर्न का अध्ययन।",
            homeFooterPlatform: "प्लेटफॉर्म",
            homeFooterElNinoAnalysis: "एल नीनो विश्लेषण",
            homeFooterClimateAnalysis: "जलवायु विश्लेषण",
            homeFooterImpactPrediction: "प्रभाव का पूर्वानुमान",
            homeFooterHistoricalData: "ऐतिहासिक डेटा",
            homeFooterExplore: "अन्वेषण करें",
            homeFooterAgriculture: "कृषि",
            homeFooterFoodPrices: "खाद्य कीमतें",
            homeFooterReports: "रिपोर्ट",
            homeFooterAboutProject: "प्रोजेक्ट के बारे में",
            homeFooterAccount: "आपका खाता",
            homeFooterLogin: "लॉगिन",
            homeFooterCreateAccount: "खाता बनाएं",
            homeFooterCopyright:
                "El Niño AI. बदलती दुनिया के लिए जलवायु इंटेलिजेंस।",
            homeFooterDisclaimer:
                "जलवायु विश्लेषण केवल जानकारी के लिए है और उपलब्ध डेटा तथा मॉडल की सीमाओं पर निर्भर करता है।"
        }
    };

    // =====================================================
    // APPLY LANGUAGE
    // =====================================================

    function applyLanguage(language) {
        if (!translations[language]) {
            language = "en";
        }

        currentLanguage = language;

        const dictionary = translations[language];

        // Translate normal text
        document.querySelectorAll("[data-i18n]").forEach(function (element) {
            const key = element.getAttribute("data-i18n");

            if (dictionary[key] !== undefined) {
                element.textContent = dictionary[key];
            }
        });

        // Translate placeholders
        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
            const key = element.getAttribute("data-i18n-placeholder");

            if (dictionary[key] !== undefined) {
                element.setAttribute("placeholder", dictionary[key]);
            }
        });

        // Translate aria labels
        document.querySelectorAll("[data-i18n-aria-label]").forEach(function (element) {
            const key = element.getAttribute("data-i18n-aria-label");

            if (dictionary[key] !== undefined) {
                element.setAttribute("aria-label", dictionary[key]);
            }
        });

        // Translate title attributes
        document.querySelectorAll("[data-i18n-title]").forEach(function (element) {
            const key = element.getAttribute("data-i18n-title");

            if (dictionary[key] !== undefined) {
                element.setAttribute("title", dictionary[key]);
            }
        });

        // Translate page title
        const pageTitle = document.querySelector("[data-i18n-page-title]");

        if (pageTitle) {
            const key = pageTitle.getAttribute("data-i18n-page-title");

            if (dictionary[key] !== undefined) {
                document.title = dictionary[key];
            }
        }

        // Update language dropdown
        const languageSelect = document.getElementById("languageSelect");

        if (languageSelect) {
            languageSelect.value = language;
        }

        // Save selected language
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

        // Dispatch language change event
        window.dispatchEvent(
            new CustomEvent("elnino:languagechange", {
                detail: { language: language }
            })
        );
    }

    // =====================================================
    // GET CURRENT LANGUAGE
    // =====================================================

    function getLanguage() {
        return currentLanguage;
    }

    // =====================================================
    // TRANSLATION FUNCTION
    // =====================================================

    function t(key) {
        const dictionary = translations[currentLanguage] || translations.en;

        return dictionary[key] || translations.en[key] || key;
    }

    // =====================================================
    // LANGUAGE SELECTOR EVENT
    // =====================================================

    function initializeLanguageSelector() {
        const languageSelect = document.getElementById("languageSelect");

        if (languageSelect) {
            languageSelect.addEventListener("change", function () {
                applyLanguage(this.value);
            });
        }
    }

    // =====================================================
    // INITIALIZE LANGUAGE
    // =====================================================

    function initializeLanguage() {
        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";

        applyLanguage(savedLanguage);
        initializeLanguageSelector();
    }

    // =====================================================
    // GLOBAL API
    // =====================================================

    window.ElNinoLanguage = {
        applyLanguage: applyLanguage,
        translations: translations,
        getLanguage: getLanguage,
        t: t
    };

    // =====================================================
    // DOM READY
    // =====================================================

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeLanguage);
    } else {
        initializeLanguage();
    }

})();
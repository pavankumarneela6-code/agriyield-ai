-- =====================================================
-- EL NINO AI
-- Climate Intelligence & Impact Prediction System
-- Database Schema
-- =====================================================


-- 1. USERS TABLE
-- User registration and login details

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2. USER LOCATIONS TABLE
-- Locations selected by users for climate analysis

CREATE TABLE IF NOT EXISTS user_locations (
    location_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_locations_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- 3. CLIMATE DATA TABLE
-- Historical and collected climate observations

CREATE TABLE IF NOT EXISTS climate_data (
    climate_id BIGSERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL,
    observation_date DATE NOT NULL,
    temperature_avg DECIMAL(6, 2),
    rainfall_mm DECIMAL(8, 2),
    humidity_percent DECIMAL(5, 2),
    wind_speed DECIMAL(7, 2),
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_climate_location
        FOREIGN KEY (location_id)
        REFERENCES user_locations(location_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_climate_observation
        UNIQUE (location_id, observation_date, source),

    CONSTRAINT valid_humidity
        CHECK (
            humidity_percent IS NULL
            OR humidity_percent BETWEEN 0 AND 100
        ),

    CONSTRAINT nonnegative_rainfall
        CHECK (
            rainfall_mm IS NULL
            OR rainfall_mm >= 0
        ),

    CONSTRAINT nonnegative_wind_speed
        CHECK (
            wind_speed IS NULL
            OR wind_speed >= 0
        )
);


-- 4. ENSO DATA TABLE
-- El Nino and La Nina climate indicators

CREATE TABLE IF NOT EXISTS enso_data (
    enso_id BIGSERIAL PRIMARY KEY,
    observation_date DATE NOT NULL UNIQUE,
    nino12 DECIMAL(5, 2),
    nino3 DECIMAL(5, 2),
    nino34 DECIMAL(5, 2),
    nino4 DECIMAL(5, 2),
    enso_phase VARCHAR(30),
    data_source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_enso_phase
        CHECK (
            enso_phase IS NULL
            OR enso_phase IN (
                'El Nino',
                'La Nina',
                'Neutral',
                'Unknown'
            )
        )
);


-- 5. PREDICTION HISTORY TABLE
-- Stores climate model prediction results

CREATE TABLE IF NOT EXISTS prediction_history (
    prediction_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    location_id INTEGER,
    prediction_type VARCHAR(50) NOT NULL,
    prediction_date DATE NOT NULL,
    forecast_period VARCHAR(50),
    predicted_value DECIMAL(12, 4),
    prediction_unit VARCHAR(30),
    risk_level VARCHAR(30),
    model_name VARCHAR(100),
    model_version VARCHAR(50),
    confidence_score DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_prediction_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_prediction_location
        FOREIGN KEY (location_id)
        REFERENCES user_locations(location_id)
        ON DELETE SET NULL,

    CONSTRAINT valid_confidence_score
        CHECK (
            confidence_score IS NULL
            OR confidence_score BETWEEN 0 AND 100
        )
);


-- =====================================================
-- INDEXES
-- Improve common database query performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_locations_user
    ON user_locations(user_id);

CREATE INDEX IF NOT EXISTS idx_climate_location_date
    ON climate_data(location_id, observation_date);

CREATE INDEX IF NOT EXISTS idx_enso_observation_date
    ON enso_data(observation_date);

CREATE INDEX IF NOT EXISTS idx_prediction_user_date
    ON prediction_history(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prediction_location
    ON prediction_history(location_id);


-- =====================================================
-- END OF SCHEMA
-- =====================================================
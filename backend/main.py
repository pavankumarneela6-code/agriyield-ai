from fastapi import FastAPI
from fastapi.responses import JSONResponse
from routes.ml_routes import router as ml_router
from routes.enso_routes import router as enso_router
from routes.climate_routes import router as climate_router


from config import Config
from database import get_db_connection
from fastapi.middleware.cors import CORSMiddleware

from routes.auth_routes import router as auth_router

from routes.location_routes import router as location_router


# Validate environment configuration
Config.validate()


# Initialize FastAPI application
app = FastAPI(
    title="El Niño AI",
    description="Climate Intelligence & Impact Prediction System",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(location_router)
app.include_router(ml_router)
app.include_router(enso_router)
app.include_router(climate_router)
# --------------------------------------------------
# 1. ROOT API
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "success": True,
        "message": "El Niño AI Backend is running!",
        "application": "El Niño AI",
        "version": "1.0.0"
    }


# --------------------------------------------------
# 2. BACKEND HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "success": True,
        "application": "El Niño AI",
        "backend_status": "running"
    }


# --------------------------------------------------
# 3. DATABASE CONNECTION TEST
# --------------------------------------------------

@app.get("/health/database")
def database_health_check():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute("SELECT current_database();")

        database_name = cursor.fetchone()[0]

        return {
            "success": True,
            "database_connected": True,
            "database_name": database_name,
            "message": "PostgreSQL connection successful!"
        }

    except Exception:
        return JSONResponse(
            status_code=503,
            content={
                "success": False,
                "database_connected": False,
                "message": "Database connection failed. Check server logs and configuration."
            }
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()


# --------------------------------------------------
# 4. API INFORMATION
# --------------------------------------------------

@app.get("/api/info")
def api_info():
    return {
        "application": "El Niño AI",
        "description": "Climate Intelligence & Impact Prediction System",
        "framework": "FastAPI",
        "database": "PostgreSQL",
        "documentation": "/docs"
    }


# --------------------------------------------------
# 5. APPLICATION ENTRY POINT
# --------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
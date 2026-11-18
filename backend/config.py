import os
from pathlib import Path
from dotenv import load_dotenv

# Backend folder path
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from backend/.env
load_dotenv(BASE_DIR / ".env")


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")

    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = int(os.getenv("DB_PORT", "5432"))
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

    @classmethod
    def validate(cls):
        required = [
            "SECRET_KEY",
            "DB_NAME",
            "DB_USER",
            "DB_PASSWORD"
        ]

        missing = [
            key for key in required
            if not getattr(cls, key)
            or getattr(cls, key).startswith("YOUR_")
            or getattr(cls, key).startswith("change_this")
        ]

        if missing:
            raise RuntimeError(
                "Missing configuration values: " + ", ".join(missing)
            )
import psycopg2
from config import Config


def get_db_connection():
    """Connect to the El Nino AI PostgreSQL database."""

    Config.validate()

    try:
        connection = psycopg2.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            database=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD
        )

        return connection

    except psycopg2.Error as error:
        print("Database connection failed:", error)
        raise
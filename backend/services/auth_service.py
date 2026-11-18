import re

from passlib.context import CryptContext
from psycopg2.errors import UniqueViolation

from database import get_db_connection


# Password hashing configuration
password_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    """Convert plain password into a secure hash."""
    return password_context.hash(password)


def register_user(full_name: str, email: str, password: str):
    """Register a new user in PostgreSQL."""

    full_name = full_name.strip()
    email = email.strip().lower()

    if not full_name:
        return {
            "success": False,
            "message": "Full name is required."
        }

    if len(full_name) > 100:
        return {
            "success": False,
            "message": "Full name must be 100 characters or fewer."
        }

    if len(password) < 8:
        return {
            "success": False,
            "message": "Password must contain at least 8 characters."
        }

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        hashed_password = hash_password(password)

        cursor.execute(
            """
            INSERT INTO users (full_name, email, password_hash)
            VALUES (%s, %s, %s)
            RETURNING user_id, full_name, email, created_at;
            """,
            (full_name, email, hashed_password)
        )

        user = cursor.fetchone()
        connection.commit()

        return {
            "success": True,
            "message": "Registration successful!",
            "user": {
                "user_id": user[0],
                "full_name": user[1],
                "email": user[2],
                "created_at": user[3].isoformat()
            }
        }

    except UniqueViolation:
        if connection:
            connection.rollback()

        return {
            "success": False,
            "message": "This email is already registered."
        }

    except Exception:
        if connection:
            connection.rollback()

        raise

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()
def login_user(email: str, password: str):
    email = email.strip().lower()

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT user_id, full_name, email, password_hash, is_active
            FROM users
            WHERE email = %s;
            """,
            (email,)
        )

        user = cursor.fetchone()

        if user is None:
            return {
                "success": False,
                "message": "Invalid email or password."
            }

        if not user[4]:
            return {
                "success": False,
                "message": "This account is inactive."
            }

        if not password_context.verify(password, user[3]):
            return {
                "success": False,
                "message": "Invalid email or password."
            }

        return {
            "success": True,
            "message": "Login successful!",
            "user": {
                "user_id": user[0],
                "full_name": user[1],
                "email": user[2]
            }
        }

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()            
from getpass import getpass

from database import get_db_connection
from services.auth_service import hash_password


def reset_local_password():
    email = input("Enter registered email: ").strip().lower()

    password = getpass("Enter a new password: ")
    confirm_password = getpass("Confirm new password: ")

    if len(password) < 8:
        print("Error: Password must contain at least 8 characters.")
        return

    if len(password) > 72:
        print("Error: Password must contain at most 72 characters.")
        return

    if password != confirm_password:
        print("Error: Passwords do not match.")
        return

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Verify that the account exists and is active.
        cursor.execute(
            """
            SELECT user_id, is_active
            FROM users
            WHERE LOWER(email) = %s;
            """,
            (email,)
        )

        user = cursor.fetchone()

        if user is None:
            print("Error: No account found for that email.")
            return

        if not user[1]:
            print("Error: Account is inactive. Password was not changed.")
            return

        # Use the same hashing function as registration.
        new_hash = hash_password(password)

        cursor.execute(
            """
            UPDATE users
            SET password_hash = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = %s;
            """,
            (new_hash, user[0])
        )

        connection.commit()
        print("Password reset successful. You can log in now.")

    except Exception as error:
        if connection:
            connection.rollback()

        print("Password reset failed. Check the backend configuration.")
        print("Error type:", type(error).__name__)

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


if __name__ == "__main__":
    reset_local_password()
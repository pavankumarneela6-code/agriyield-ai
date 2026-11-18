from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

from config import Config
from services.auth_service import register_user, login_user

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# JWT authentication scheme
security = HTTPBearer()

# Verify JWT token
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            Config.SECRET_KEY,
            algorithms=["HS256"]
        )

        user_id = payload.get("sub")
        email = payload.get("email")

        if not user_id or not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token."
            )

        return {
            "user_id": int(user_id),
            "email": email
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expired. Please log in again."
        )

    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token."
        )


# --------------------------------------------------
# REQUEST MODELS
# --------------------------------------------------

class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


# --------------------------------------------------
# REGISTER API
# --------------------------------------------------

@router.post("/register", status_code=201)
def register(request: RegisterRequest):
    try:
        result = register_user(
            full_name=request.full_name,
            email=str(request.email),
            password=request.password
        )

        if not result["success"]:
            if "already registered" in result["message"]:
                raise HTTPException(
                    status_code=409,
                    detail=result["message"]
                )

            raise HTTPException(
                status_code=400,
                detail=result["message"]
            )

        return result

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Registration failed because of a server error."
        )


# --------------------------------------------------
# LOGIN API WITH JWT
# --------------------------------------------------

@router.post("/login")
def login(request: LoginRequest):
    try:
        result = login_user(
            email=str(request.email),
            password=request.password
        )

        if not result["success"]:
            if result["message"] == "This account is inactive.":
                raise HTTPException(
                    status_code=403,
                    detail=result["message"]
                )

            raise HTTPException(
                status_code=401,
                detail=result["message"]
            )

        # Create JWT payload
        now = datetime.now(timezone.utc)

        payload = {
            "sub": str(result["user"]["user_id"]),
            "email": result["user"]["email"],
            "iat": now,
            "exp": now + timedelta(minutes=30)
        }

        # Sign the token
        access_token = jwt.encode(
            payload,
            Config.SECRET_KEY,
            algorithm="HS256"
        )

        return {
            "success": True,
            "message": "Login successful!",
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": 1800,
            "user": result["user"]
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Login failed because of a server error."
        )

@router.get("/me")
def get_my_profile(
    current_user: dict = Depends(get_current_user)
):
    return {
        "success": True,
        "message": "Authentication successful!",
        "user": current_user
    }        
        
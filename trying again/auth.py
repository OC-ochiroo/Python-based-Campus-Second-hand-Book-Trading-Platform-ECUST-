from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# bcrypt hard limit is 72 bytes — truncate silently before hashing
_BCRYPT_LIMIT = 72


def hash_password(password: str):
    try:
        truncated = password.encode("utf-8")[:_BCRYPT_LIMIT].decode("utf-8", errors="ignore")
        return pwd_context.hash(truncated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to hash password: {str(e)}") from e


def verify_password(plain_password, hashed_password):
    try:
        truncated = plain_password.encode("utf-8")[:_BCRYPT_LIMIT].decode("utf-8", errors="ignore")
        return pwd_context.verify(truncated, hashed_password)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Password verification error: {str(e)}") from e


def create_access_token(data: dict):
    try:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    except JWTError as e:
        raise HTTPException(status_code=500, detail=f"Failed to create access token: {str(e)}") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error during token creation: {str(e)}") from e


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

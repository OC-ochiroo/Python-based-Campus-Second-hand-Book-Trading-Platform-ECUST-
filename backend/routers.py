from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session

import schemas
import crud
import models

from database import get_db
from auth import (
    verify_password,
    create_access_token,
    decode_access_token,
)

router = APIRouter(prefix="/auth")


@router.post("/register")
def register(
    user: schemas.UserCreate,
    response: Response,
    db: Session = Depends(get_db)
):
    existing_user = crud.get_user_by_email(db, user.email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    db_user = crud.create_user(db, user)

    token = create_access_token({"sub": db_user.email})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax"
    )

    return {
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
        }
    }


@router.post("/login")
def login(
    user: schemas.UserLogin,
    response: Response,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_email(db, user.email)

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token({"sub": db_user.email})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax"
    )

    return {
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
        }
    }


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}


@router.get("/me")
def me(
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    email = decode_access_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db_user = crud.get_user_by_email(db, email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
        }
    }


@router.get("/users", response_model=list[schemas.UserResponse])
def read_users(db: Session = Depends(get_db)):
    return crud.get_users(db)


@router.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
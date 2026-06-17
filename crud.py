from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

import models
import schemas
from auth import hash_password


def get_user_by_email(db: Session, email: str):
    try:
        return db.query(models.User).filter(models.User.email == email).first()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error while fetching user by email: {str(e)}") from e


def create_user(db: Session, user: schemas.UserCreate):
    try:
        hashed_pw = hash_password(user.password)
        db_user = models.User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_pw
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error while creating user: {str(e)}") from e
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error while creating user: {str(e)}") from e


def get_users(db: Session):
    try:
        return db.query(models.User).all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error while fetching users: {str(e)}") from e


def get_user(db: Session, user_id: int):
    try:
        return db.query(models.User).filter(models.User.id == user_id).first()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error while fetching user: {str(e)}") from e


def delete_user(db: Session, user_id: int):
    try:
        user = get_user(db, user_id)
        if user:
            db.delete(user)
            db.commit()
        return user
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error while deleting user: {str(e)}") from e
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error while deleting user: {str(e)}") from e
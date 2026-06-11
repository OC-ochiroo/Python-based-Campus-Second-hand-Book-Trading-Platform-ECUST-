from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

import models
import schemas
from auth import hash_password


# ─── Users ────────────────────────────────────────────────────────────────────

def get_user_by_email(db: Session, email: str):
    try:
        return db.query(models.User).filter(models.User.email == email).first()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}") from e


def create_user(db: Session, user: schemas.UserCreate):
    try:
        hashed_pw = hash_password(user.password)
        db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_pw)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB error creating user: {str(e)}") from e


def get_users(db: Session):
    return db.query(models.User).all()


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def update_user(db: Session, user_id: int, payload: schemas.ProfileUpdate):
    try:
        user = get_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if payload.wechat_username is not None:
            user.wechat_username = payload.wechat_username
        if payload.age is not None:
            user.age = payload.age
        db.commit()
        db.refresh(user)
        return user
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB error updating user: {str(e)}") from e


def delete_user(db: Session, user_id: int):
    try:
        user = get_user(db, user_id)
        if user:
            db.delete(user)
            db.commit()
        return user
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB error deleting user: {str(e)}") from e


# ─── Posts ────────────────────────────────────────────────────────────────────

def get_posts(db: Session):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).all()


def get_posts_by_user(db: Session, user_id: int):
    return db.query(models.Post).filter(models.Post.user_id == user_id).order_by(models.Post.created_at.desc()).all()


def get_post(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()


def create_post(db: Session, user_id: int, payload: schemas.PostCreate):
    try:
        post = models.Post(
            user_id=user_id,
            title=payload.title,
            author=payload.author,
            year=payload.year,
            rating=payload.rating,
            price=payload.price,
            description=payload.description,
        )
        db.add(post)
        db.commit()
        db.refresh(post)
        return post
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB error creating post: {str(e)}") from e


def update_post(db: Session, post_id: int, payload: schemas.PostUpdate):
    try:
        post = get_post(db, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(post, field, value)
        db.commit()
        db.refresh(post)
        return post
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB error updating post: {str(e)}") from e


def delete_post(db: Session, post_id: int):
    try:
        db.query(models.Comment).filter(models.Comment.post_id == post_id).delete()
        post = get_post(db, post_id)
        if post:
            db.delete(post)
            db.commit()
        return post
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB error deleting post: {str(e)}") from e


# ─── Comments ─────────────────────────────────────────────────────────────────

def get_comments(db: Session, post_id: int):
    comments = db.query(models.Comment).filter(models.Comment.post_id == post_id).order_by(models.Comment.created_at.asc()).all()
    return [
        {
            "id": c.id,
            "post_id": c.post_id,
            "user_id": c.user_id,
            "author_username": c.author_username,
            "text": c.text,
            "created_at": c.created_at.isoformat(),
        }
        for c in comments
    ]


def get_comment(db: Session, comment_id: int):
    return db.query(models.Comment).filter(models.Comment.id == comment_id).first()


def create_comment(db: Session, post_id: int, user_id: int, author_username: str, payload: schemas.CommentCreate):
    try:
        comment = models.Comment(
            post_id=post_id,
            user_id=user_id,
            author_username=author_username,
            text=payload.text,
        )
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return {
            "id": comment.id,
            "post_id": comment.post_id,
            "user_id": comment.user_id,
            "author_username": comment.author_username,
            "text": comment.text,
            "created_at": comment.created_at.isoformat(),
        }
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB error creating comment: {str(e)}") from e


def delete_comment(db: Session, comment_id: int):
    try:
        comment = get_comment(db, comment_id)
        if comment:
            db.delete(comment)
            db.commit()
        return comment
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"DB error deleting comment: {str(e)}") from e
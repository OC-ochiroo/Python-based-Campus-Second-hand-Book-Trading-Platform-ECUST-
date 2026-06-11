from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

import models
import schemas
from auth import hash_password


# ── User CRUD (Kaiyi's — unchanged) ──────────────────────────────────────────

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


# ── Post CRUD ─────────────────────────────────────────────────────────────────

def _post_to_dict(post: models.Post, db: Session) -> dict:
    """Attach owner_username and owner_wechat — matches frontend Post type."""
    user = db.query(models.User).filter(models.User.id == post.user_id).first()
    return {
        "id": post.id,
        "user_id": post.user_id,
        "owner_username": user.username if user else "unknown",
        "owner_wechat": user.wechat_username if user else None,
        "title": post.title,
        "author": post.author,
        "year": post.year,
        "rating": post.rating,
        "price": post.price,
        "description": post.description,
        "status": post.status,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }


def get_all_posts(db: Session) -> list[dict]:
    try:
        posts = db.query(models.Post).order_by(models.Post.created_at.desc()).all()
        return [_post_to_dict(p, db) for p in posts]
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error fetching posts: {str(e)}") from e


def get_posts_by_user(db: Session, user_id: int) -> list[dict]:
    try:
        posts = (
            db.query(models.Post)
            .filter(models.Post.user_id == user_id)
            .order_by(models.Post.created_at.desc())
            .all()
        )
        return [_post_to_dict(p, db) for p in posts]
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error fetching user posts: {str(e)}") from e


def create_post(db: Session, post_data: schemas.PostCreate, user_id: int) -> dict:
    try:
        post = models.Post(
            user_id=user_id,
            title=post_data.title,
            author=post_data.author,
            year=post_data.year,
            rating=post_data.rating,
            price=post_data.price,
            description=post_data.description,
            status=post_data.status,
        )
        db.add(post)
        db.commit()
        db.refresh(post)
        return _post_to_dict(post, db)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error creating post: {str(e)}") from e


# ── Comment CRUD ──────────────────────────────────────────────────────────────

def _comment_to_dict(comment: models.Comment, db: Session) -> dict:
    """Uses author_username and text — matches frontend Comment type."""
    user = db.query(models.User).filter(models.User.id == comment.user_id).first()
    return {
        "id": comment.id,
        "post_id": comment.post_id,
        "user_id": comment.user_id,
        "author_username": user.username if user else "unknown",
        "text": comment.content,
        "created_at": comment.created_at,
    }


def get_comments_by_post(db: Session, post_id: int) -> list[dict]:
    try:
        post = db.query(models.Post).filter(models.Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        comments = (
            db.query(models.Comment)
            .filter(models.Comment.post_id == post_id)
            .order_by(models.Comment.created_at.asc())
            .all()
        )
        return [_comment_to_dict(c, db) for c in comments]
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error fetching comments: {str(e)}") from e


def create_comment(db: Session, post_id: int, comment_data: schemas.CommentCreate, user_id: int) -> dict:
    try:
        post = db.query(models.Post).filter(models.Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        comment = models.Comment(
            post_id=post_id,
            user_id=user_id,
            content=comment_data.text,   # frontend sends "text", DB column is "content"
        )
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return _comment_to_dict(comment, db)
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error creating comment: {str(e)}") from e

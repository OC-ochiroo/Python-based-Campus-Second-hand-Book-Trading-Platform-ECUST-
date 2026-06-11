from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session

import schemas
import crud

from database import get_db
from auth import verify_password, create_access_token, decode_access_token

# ─── Auth helpers ──────────────────────────────────────────────────────────────

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    email = decode_access_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ─── Auth routes ──────────────────────────────────────────────────────────────

auth_router = APIRouter(prefix="/auth")


@auth_router.post("/register")
def register(user: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):
    try:
        existing_user = crud.get_user_by_email(db, user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        db_user = crud.create_user(db, user)
        token = create_access_token({"sub": db_user.email})
        response.set_cookie(key="access_token", value=token, httponly=True, secure=False, samesite="lax")
        return {"user": {"id": db_user.id, "username": db_user.username, "email": db_user.email}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") from e


@auth_router.post("/login")
def login(user: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    try:
        db_user = crud.get_user_by_email(db, user.email)
        if not db_user or not verify_password(user.password, db_user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_access_token({"sub": db_user.email})
        response.set_cookie(key="access_token", value=token, httponly=True, secure=False, samesite="lax")
        return {
            "user": {
                "id": db_user.id,
                "username": db_user.username,
                "email": db_user.email,
                "wechat_username": db_user.wechat_username,
                "age": db_user.age,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") from e


@auth_router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}


@auth_router.get("/me")
def me(request: Request, db: Session = Depends(get_db)):
    try:
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
                "wechat_username": db_user.wechat_username,
                "age": db_user.age,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") from e


@auth_router.get("/users", response_model=list[schemas.UserResponse])
def read_users(db: Session = Depends(get_db)):
    return crud.get_users(db)


@auth_router.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@auth_router.delete("/users/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}


# ─── Users routes ─────────────────────────────────────────────────────────────

users_router = APIRouter(prefix="/users")


@users_router.put("/me")
def update_me(payload: schemas.ProfileUpdate, request: Request, db: Session = Depends(get_db)):
    current_user = get_current_user(request, db)
    try:
        updated = crud.update_user(db, current_user.id, payload)
        return {
            "id": updated.id,
            "username": updated.username,
            "email": updated.email,
            "wechat_username": updated.wechat_username,
            "age": updated.age,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") from e


# ─── Posts routes ─────────────────────────────────────────────────────────────

posts_router = APIRouter(prefix="/posts")


def _post_to_dict(post, db: Session):
    import models as m
    owner = db.query(m.User).filter(m.User.id == post.user_id).first()
    return {
        "id": post.id,
        "user_id": post.user_id,
        "title": post.title,
        "author": post.author,
        "year": post.year,
        "rating": post.rating,
        "price": post.price,
        "description": post.description,
        "status": post.status,
        "created_at": post.created_at.isoformat() if post.created_at else None,
        "updated_at": post.updated_at.isoformat() if post.updated_at else None,
        "owner_username": owner.username if owner else None,
        "owner_wechat": owner.wechat_username if owner else None,
    }


@posts_router.get("")
def list_posts(db: Session = Depends(get_db)):
    posts = crud.get_posts(db)
    return [_post_to_dict(p, db) for p in posts]


@posts_router.get("/me")
def my_posts(request: Request, db: Session = Depends(get_db)):
    current_user = get_current_user(request, db)
    posts = crud.get_posts_by_user(db, current_user.id)
    return [_post_to_dict(p, db) for p in posts]


@posts_router.post("")
def create_post(payload: schemas.PostCreate, request: Request, db: Session = Depends(get_db)):
    current_user = get_current_user(request, db)
    post = crud.create_post(db, current_user.id, payload)
    return _post_to_dict(post, db)


@posts_router.put("/{post_id}")
def update_post(post_id: int, payload: schemas.PostUpdate, request: Request, db: Session = Depends(get_db)):
    current_user = get_current_user(request, db)
    post = crud.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your post")
    updated = crud.update_post(db, post_id, payload)
    return _post_to_dict(updated, db)


@posts_router.delete("/{post_id}")
def delete_post(post_id: int, request: Request, db: Session = Depends(get_db)):
    current_user = get_current_user(request, db)
    post = crud.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your post")
    crud.delete_post(db, post_id)
    return {"message": "Post deleted"}


@posts_router.get("/{post_id}/comments")
def list_comments(post_id: int, db: Session = Depends(get_db)):
    return crud.get_comments(db, post_id)


@posts_router.post("/{post_id}/comments")
def add_comment(post_id: int, payload: schemas.CommentCreate, request: Request, db: Session = Depends(get_db)):
    current_user = get_current_user(request, db)
    post = crud.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return crud.create_comment(db, post_id, current_user.id, current_user.username, payload)


@posts_router.delete("/{post_id}/comments/{comment_id}")
def remove_comment(post_id: int, comment_id: int, request: Request, db: Session = Depends(get_db)):
    current_user = get_current_user(request, db)
    comment = crud.get_comment(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your comment")
    crud.delete_comment(db, comment_id)
    return {"message": "Comment deleted"}
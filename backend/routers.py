from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session

import schemas
import crud

from database import get_db
from auth import verify_password, create_access_token, decode_access_token

router = APIRouter()


# ── Auth routes (Kaiyi's — unchanged) ────────────────────────────────────────

auth_router = APIRouter(prefix="/auth")


@auth_router.post("/register")
def register(user: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):
    try:
        existing_user = crud.get_user_by_email(db, user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error during registration: {str(e)}") from e


@auth_router.post("/login")
def login(user: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    try:
        db_user = crud.get_user_by_email(db, user.email)
        if not db_user or not verify_password(user.password, db_user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error during login: {str(e)}") from e


@auth_router.post("/logout")
def logout(response: Response):
    try:
        response.delete_cookie("access_token")
        return {"message": "Logged out"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error during logout: {str(e)}") from e


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
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error fetching current user: {str(e)}") from e


@auth_router.get("/users", response_model=list[schemas.UserResponse])
def read_users(db: Session = Depends(get_db)):
    try:
        return crud.get_users(db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error while fetching users: {str(e)}") from e


@auth_router.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = crud.get_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error while fetching user: {str(e)}") from e


@auth_router.delete("/users/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = crud.delete_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "User deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error while deleting user: {str(e)}") from e


# ── Posts routes ──────────────────────────────────────────────────────────────

posts_router = APIRouter(prefix="/posts")


def _require_current_user_id(request: Request, db: Session) -> int:
    """Read the access_token cookie and return the user's id, or raise 401."""
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    email = decode_access_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.id


@posts_router.get("", response_model=list[schemas.PostResponse])
def get_all_posts(db: Session = Depends(get_db)):
    try:
        return crud.get_all_posts(db)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") from e


@posts_router.get("/user", response_model=list[schemas.PostResponse])
def get_my_posts(request: Request, db: Session = Depends(get_db)):
    try:
        user_id = _require_current_user_id(request, db)
        return crud.get_posts_by_user(db, user_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") from e


@posts_router.post("/add", response_model=schemas.PostResponse, status_code=201)
def add_post(post_data: schemas.PostCreate, request: Request, db: Session = Depends(get_db)):
    try:
        user_id = _require_current_user_id(request, db)
        return crud.create_post(db, post_data, user_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") from e


@posts_router.get("/{post_id}/comments", response_model=list[schemas.CommentResponse])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    try:
        return crud.get_comments_by_post(db, post_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") from e


@posts_router.post("/{post_id}/comments/add", response_model=schemas.CommentResponse, status_code=201)
def add_comment(
    post_id: int,
    comment_data: schemas.CommentCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    try:
        user_id = _require_current_user_id(request, db)
        return crud.create_comment(db, post_id, comment_data, user_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}") from e


# ── Register both routers ─────────────────────────────────────────────────────
router.include_router(auth_router)
router.include_router(posts_router)

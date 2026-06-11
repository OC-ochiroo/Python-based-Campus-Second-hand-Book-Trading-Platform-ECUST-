from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator


# ── User schemas (Kaiyi's — unchanged) ───────────────────────────────────────

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v):
        if len(v.strip()) == 0:
            raise ValueError("Username cannot be empty")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Post schemas ──────────────────────────────────────────────────────────────

class PostCreate(BaseModel):
    title: str
    author: str | None = None
    year: int | None = None
    rating: int | None = None
    price: float | None = None
    description: str | None = None
    status: str = "available"

    @field_validator("title")
    @classmethod
    def validate_title(cls, v):
        if len(v.strip()) == 0:
            raise ValueError("Title cannot be empty")
        return v


class PostResponse(BaseModel):
    id: int
    user_id: int
    # Frontend expects owner_username / owner_wechat (not "username")
    owner_username: str
    owner_wechat: str | None
    title: str
    author: str | None
    year: int | None
    rating: int | None
    price: float | None
    description: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Comment schemas ───────────────────────────────────────────────────────────

class CommentCreate(BaseModel):
    # Frontend sends { text } not { content }
    text: str

    @field_validator("text")
    @classmethod
    def validate_text(cls, v):
        if len(v.strip()) == 0:
            raise ValueError("Comment cannot be empty")
        return v


class CommentResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    # Frontend expects author_username (not "username")
    author_username: str
    # Frontend expects text (not "content")
    text: str
    created_at: datetime

    model_config = {"from_attributes": True}

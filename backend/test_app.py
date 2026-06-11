"""
Unit tests for auth.py, crud.py, and schemas.py
"""
import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from datetime import datetime

# ── auth.py tests ─────────────────────────────────────────────────────────────

from auth import hash_password, verify_password, create_access_token


class TestHashPassword:
    def test_returns_hashed_string(self):
        result = hash_password("mysecretpassword")
        assert isinstance(result, str)
        assert result != "mysecretpassword"

    def test_different_hashes_for_same_password(self):
        h1 = hash_password("password123")
        h2 = hash_password("password123")
        assert h1 != h2  # bcrypt uses random salt

    def test_long_password_does_not_crash(self):
        long_pw = "a" * 100
        result = hash_password(long_pw)
        assert isinstance(result, str)


class TestVerifyPassword:
    def test_correct_password_returns_true(self):
        hashed = hash_password("correctpassword")
        assert verify_password("correctpassword", hashed) is True

    def test_wrong_password_returns_false(self):
        hashed = hash_password("correctpassword")
        assert verify_password("wrongpassword", hashed) is False

    def test_long_password_verifies_correctly(self):
        long_pw = "a" * 100
        hashed = hash_password(long_pw)
        assert verify_password(long_pw, hashed) is True


class TestCreateAccessToken:
    def test_returns_string_token(self):
        token = create_access_token({"sub": "user@example.com"})
        assert isinstance(token, str)
        assert len(token) > 0

    def test_token_contains_expected_data(self):
        from jose import jwt
        from auth import SECRET_KEY, ALGORITHM
        token = create_access_token({"sub": "user@example.com"})
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert decoded["sub"] == "user@example.com"

    def test_token_has_expiry(self):
        from jose import jwt
        from auth import SECRET_KEY, ALGORITHM
        token = create_access_token({"sub": "test@test.com"})
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert "exp" in decoded


# ── crud.py tests ─────────────────────────────────────────────────────────────

import crud
import models
import schemas


class TestGetUserByEmail:
    def test_returns_user_when_found(self):
        mock_db = MagicMock()
        mock_user = MagicMock()
        mock_db.query.return_value.filter.return_value.first.return_value = mock_user
        result = crud.get_user_by_email(mock_db, "test@example.com")
        assert result == mock_user

    def test_returns_none_when_not_found(self):
        mock_db = MagicMock()
        mock_db.query.return_value.filter.return_value.first.return_value = None
        result = crud.get_user_by_email(mock_db, "missing@example.com")
        assert result is None


class TestGetUsers:
    def test_returns_list_of_users(self):
        mock_db = MagicMock()
        mock_users = [MagicMock(), MagicMock()]
        mock_db.query.return_value.all.return_value = mock_users
        result = crud.get_users(mock_db)
        assert result == mock_users
        assert len(result) == 2

    def test_returns_empty_list(self):
        mock_db = MagicMock()
        mock_db.query.return_value.all.return_value = []
        result = crud.get_users(mock_db)
        assert result == []


class TestDeleteUser:
    def test_deletes_existing_user(self):
        mock_db = MagicMock()
        mock_user = MagicMock()
        mock_db.query.return_value.filter.return_value.first.return_value = mock_user
        result = crud.delete_user(mock_db, 1)
        mock_db.delete.assert_called_once_with(mock_user)
        mock_db.commit.assert_called_once()
        assert result == mock_user

    def test_returns_none_for_missing_user(self):
        mock_db = MagicMock()
        mock_db.query.return_value.filter.return_value.first.return_value = None
        result = crud.delete_user(mock_db, 999)
        mock_db.delete.assert_not_called()
        assert result is None


# ── schemas.py tests ──────────────────────────────────────────────────────────

from schemas import UserCreate, UserLogin, UserResponse, PostCreate, CommentCreate


class TestUserCreate:
    def test_valid_user_passes(self):
        user = UserCreate(username="alice", email="alice@example.com", password="securepass")
        assert user.username == "alice"

    def test_short_password_raises(self):
        with pytest.raises(Exception):
            UserCreate(username="alice", email="alice@example.com", password="short")

    def test_empty_username_raises(self):
        with pytest.raises(Exception):
            UserCreate(username="   ", email="alice@example.com", password="securepass")

    def test_invalid_email_raises(self):
        with pytest.raises(Exception):
            UserCreate(username="alice", email="not-an-email", password="securepass")


class TestUserLogin:
    def test_valid_login_schema(self):
        login = UserLogin(email="user@example.com", password="anypassword")
        assert login.email == "user@example.com"

    def test_invalid_email_raises(self):
        with pytest.raises(Exception):
            UserLogin(email="bademail", password="password")


class TestUserResponse:
    def test_builds_from_attributes(self):
        mock_user = MagicMock()
        mock_user.id = 1
        mock_user.username = "alice"
        mock_user.email = "alice@example.com"
        mock_user.created_at = datetime(2024, 1, 1)
        response = UserResponse.model_validate(mock_user)
        assert response.id == 1
        assert response.username == "alice"


class TestPostCreate:
    def test_valid_post_passes(self):
        post = PostCreate(title="Dune", author="Frank Herbert", year=1965, rating=5, price=9.99)
        assert post.title == "Dune"

    def test_empty_title_raises(self):
        with pytest.raises(Exception):
            PostCreate(title="   ")

    def test_optional_fields_default_none(self):
        post = PostCreate(title="Dune")
        assert post.author is None
        assert post.year is None


class TestCommentCreate:
    def test_valid_comment_passes(self):
        comment = CommentCreate(text="Great book!")
        assert comment.text == "Great book!"

    def test_empty_text_raises(self):
        with pytest.raises(Exception):
            CommentCreate(text="   ")

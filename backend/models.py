from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    wechat_username = Column(String(100))
    age = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Post(Base):
    __tablename__ = "post"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    title = Column(String(255), nullable=False)
    author = Column(String(100))
    year = Column(Integer)
    rating = Column(Integer)
    price = Column(Float)
    description = Column(Text)
    status = Column(String(50), default="available")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Trade(Base):
    __tablename__ = "trade"

    id = Column(Integer, primary_key=True, index=True)
    post_from_id = Column(Integer, ForeignKey("post.id"), nullable=False)
    post_to_id = Column(Integer, ForeignKey("post.id"), nullable=False)
    status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class AuditLog(Base):
    __tablename__ = "auditlog"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

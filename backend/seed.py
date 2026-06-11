"""
seed.py — populate the database with demo users and posts.
Run automatically on startup (called from main.py).
Safe to re-run: skips users/posts that already exist.
"""

from sqlalchemy.orm import Session
from auth import hash_password
import models


DEMO_USERS = [
    {"username": "alice_tw", "email": "alice@ecust.edu.cn", "password": "password123", "wechat_username": "alice_wechat"},
    {"username": "bob_reads", "email": "bob@ecust.edu.cn", "password": "password123", "wechat_username": "bob_reads_wx"},
    {"username": "carol_uni", "email": "carol@ecust.edu.cn", "password": "password123", "wechat_username": "carol_uni_wx"},
    {"username": "dave_lib", "email": "dave@ecust.edu.cn", "password": "password123", "wechat_username": "dave_lib_wx"},
]

DEMO_POSTS = [
    {"username": "alice_tw", "title": "Clean Code", "author": "Robert C. Martin", "year": 2008, "rating": 5, "price": 35.0, "description": "A handbook of agile software craftsmanship."},
    {"username": "alice_tw", "title": "The Pragmatic Programmer", "author": "David Thomas", "year": 2019, "rating": 5, "price": 40.0, "description": "Timeless advice for software developers."},
    {"username": "bob_reads", "title": "Atomic Habits", "author": "James Clear", "year": 2018, "rating": 4, "price": 28.0, "description": "An easy and proven way to build good habits."},
    {"username": "bob_reads", "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann", "year": 2017, "rating": 5, "price": 55.0, "description": "The big ideas behind reliable, scalable systems."},
    {"username": "carol_uni", "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "year": 1925, "rating": 4, "price": 15.0, "description": "A portrait of the Jazz Age."},
    {"username": "carol_uni", "title": "Introduction to Algorithms", "author": "Cormen et al.", "year": 2009, "rating": 5, "price": 60.0, "description": "The comprehensive reference on algorithms."},
    {"username": "dave_lib", "title": "Computer Networks", "author": "Tanenbaum & Wetherall", "year": 2011, "rating": 4, "price": 45.0, "description": "A top-down approach to networking."},
    {"username": "dave_lib", "title": "Operating System Concepts", "author": "Silberschatz et al.", "year": 2018, "rating": 4, "price": 50.0, "description": "The classic OS textbook."},
]


def seed(db: Session):
    user_map: dict[str, models.User] = {}

    for u in DEMO_USERS:
        existing = db.query(models.User).filter(models.User.email == u["email"]).first()
        if not existing:
            db_user = models.User(
                username=u["username"],
                email=u["email"],
                hashed_password=hash_password(u["password"]),
                wechat_username=u.get("wechat_username"),
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            user_map[u["username"]] = db_user
            print(f"[seed] Created user: {u['username']}")
        else:
            user_map[u["username"]] = existing

    for p in DEMO_POSTS:
        owner = user_map.get(p["username"])
        if not owner:
            continue
        exists = (
            db.query(models.Post)
            .filter(models.Post.user_id == owner.id, models.Post.title == p["title"])
            .first()
        )
        if not exists:
            post = models.Post(
                user_id=owner.id,
                title=p["title"],
                author=p.get("author"),
                year=p.get("year"),
                rating=p.get("rating"),
                price=p.get("price"),
                description=p.get("description"),
            )
            db.add(post)
            db.commit()
            print(f"[seed] Created post: {p['title']}")
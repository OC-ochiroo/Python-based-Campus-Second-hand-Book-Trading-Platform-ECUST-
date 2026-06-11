"""
Seed script — run once before the demo to pre-fill the DB.

Usage:
    python seed.py
"""
from datetime import datetime
from database import SessionLocal, engine
from models import Base, User, Post, Comment
from auth import hash_password

Base.metadata.create_all(bind=engine)

USERS = [
    {"username": "alice",   "email": "alice@example.com",   "password": "password123"},
    {"username": "bob",     "email": "bob@example.com",     "password": "password123"},
    {"username": "charlie", "email": "charlie@example.com", "password": "password123"},
]

POSTS = [
    {"username": "alice",   "title": "The Great Gatsby",                    "author": "F. Scott Fitzgerald", "year": 1925, "rating": 4, "price": 8.99,  "description": "A story of wealth, love, and the American Dream in the Jazz Age.",          "status": "available"},
    {"username": "alice",   "title": "To Kill a Mockingbird",               "author": "Harper Lee",          "year": 1960, "rating": 5, "price": 10.50, "description": "A powerful exploration of racial injustice in the American South.",          "status": "available"},
    {"username": "bob",     "title": "1984",                                "author": "George Orwell",       "year": 1949, "rating": 5, "price": 9.99,  "description": "A dystopian novel about totalitarianism and surveillance society.",           "status": "available"},
    {"username": "bob",     "title": "Brave New World",                     "author": "Aldous Huxley",       "year": 1932, "rating": 4, "price": 7.49,  "description": "A futuristic society controlled by technology and conditioning.",            "status": "available"},
    {"username": "charlie", "title": "The Hitchhiker's Guide to the Galaxy","author": "Douglas Adams",       "year": 1979, "rating": 5, "price": 11.00, "description": "A comedic sci-fi adventure across the universe. The answer is 42.",          "status": "available"},
    {"username": "charlie", "title": "Dune",                                "author": "Frank Herbert",       "year": 1965, "rating": 5, "price": 13.99, "description": "An epic tale of politics, religion, and ecology on a desert planet.",        "status": "traded"},
]

COMMENTS = [
    {"post_title": "The Great Gatsby",                     "username": "bob",     "content": "Classic read, the symbolism is incredible!"},
    {"post_title": "The Great Gatsby",                     "username": "charlie", "content": "Interested in trading for this one."},
    {"post_title": "1984",                                 "username": "alice",   "content": "Still feels relevant today. A must-read."},
    {"post_title": "1984",                                 "username": "charlie", "content": "Big Brother is watching... chilling book."},
    {"post_title": "The Hitchhiker's Guide to the Galaxy", "username": "alice",   "content": "Don't panic! Loved every page of this."},
    {"post_title": "The Hitchhiker's Guide to the Galaxy", "username": "bob",     "content": "Is this still available? Would love to trade."},
    {"post_title": "Dune",                                 "username": "alice",   "content": "The world-building is unmatched. Great trade!"},
    {"post_title": "Dune",                                 "username": "bob",     "content": "Lucky person who got this one."},
]


def seed():
    db = SessionLocal()
    try:
        if db.query(User).first():
            print("Database already seeded — skipping.")
            return

        print("Seeding users...")
        user_map = {}
        for u in USERS:
            user = User(username=u["username"], email=u["email"], hashed_password=hash_password(u["password"]), created_at=datetime.utcnow())
            db.add(user)
            db.flush()
            user_map[u["username"]] = user

        print("Seeding posts...")
        post_map = {}
        for p in POSTS:
            post = Post(user_id=user_map[p["username"]].id, title=p["title"], author=p["author"], year=p["year"], rating=p["rating"], price=p["price"], description=p["description"], status=p["status"], created_at=datetime.utcnow(), updated_at=datetime.utcnow())
            db.add(post)
            db.flush()
            post_map[p["title"]] = post

        print("Seeding comments...")
        for c in COMMENTS:
            db.add(Comment(post_id=post_map[c["post_title"]].id, user_id=user_map[c["username"]].id, content=c["content"], created_at=datetime.utcnow()))

        db.commit()
        print(f"Done! Seeded {len(USERS)} users, {len(POSTS)} posts, {len(COMMENTS)} comments.")

    except Exception as e:
        db.rollback()
        print(f"Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()

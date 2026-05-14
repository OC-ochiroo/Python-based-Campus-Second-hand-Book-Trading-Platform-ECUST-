from sqlalchemy.orm import Session

import models
import schemas
from auth import hash_password



def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(
        models.User.email == email
    ).first()



def create_user(db: Session, user: schemas.UserCreate):
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



def get_users(db: Session):
    return db.query(models.User).all()



def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(
        models.User.id == user_id
    ).first()



def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)

    if user:
        db.delete(user)
        db.commit()

    return user
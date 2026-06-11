from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import models
from database import engine, SessionLocal
from routers import auth_router, users_router, posts_router

try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[STARTUP ERROR] Failed to initialize database tables: {e}")
    raise

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(posts_router)


@app.exception_handler(Exception)
async def global_exception_handler(_, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )


@app.get("/")
def root():
    return {"message": "Backend running"}


@app.on_event("startup")
def on_startup():
    from seed import seed
    db = SessionLocal()
    try:
        seed(db)
    except Exception as e:
        print(f"[SEED WARNING] Seed failed: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
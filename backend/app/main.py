from fastapi import FastAPI
from app.api.v1.routers import router as api_router
from app.db.session import engine
from sqlmodel import SQLModel

app = FastAPI(title="Node Manager API")

SQLModel.metadata.create_all(bind=engine)

app.include_router(api_router, prefix="/api/v1")
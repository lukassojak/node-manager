from sqlmodel import create_engine
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./node_manager.db")
engine = create_engine(DATABASE_URL, echo=False)

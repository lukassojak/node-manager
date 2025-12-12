from fastapi import APIRouter
from sqlmodel import Session, select
from app.db.session import engine
from app.models.node import Node

router = APIRouter()

@router.get("/", summary="List nodes")
def list_nodes():
    with Session(engine) as session:
        return session.exec(select(Node)).all()

@router.post("/", summary="Create node")
def create_node(node: Node):
    with Session(engine) as session:
        session.add(node)
        session.commit()
        session.refresh(node)
        return node

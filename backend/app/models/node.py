from sqlmodel import SQLModel, Field
from typing import Optional

class Node(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    location: Optional[str] = None

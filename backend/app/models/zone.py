from sqlmodel import SQLModel, Field
from typing import Optional

class Zone(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    node_id: Optional[int] = Field(default=None, foreign_key="node.id")
    name: str

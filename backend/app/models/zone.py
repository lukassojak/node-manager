from sqlmodel import SQLModel, Field, Relationship, Column, JSON
from enum import Enum


class IrrigationMode(str, Enum):
    EVEN_AREA = "even_area"
    PER_PLANT = "per_plant"


class Zone(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    node_id: int = Field(foreign_key="node.id")

    name: str = Field(index=True)
    relay_pin: int
    enabled: bool = True

    irrigation_mode: IrrigationMode
    target_mm: float | None = None
    zone_area_m2: float | None = None
    base_target_volume_liters: float | None = None

    # nested configurations stored as JSON
    local_correction_factors: dict | None = Field(default=None, sa_column=Column(JSON))
    frequency_settings: dict | None = Field(default=None, sa_column=Column(JSON))
    fallback_strategy: dict | None = Field(default=None, sa_column=Column(JSON))
    irrigation_configuration: dict | None = Field(default=None, sa_column=Column(JSON))
    emitters_configuration: dict | None = Field(default=None, sa_column=Column(JSON))

    node: "Node" = Relationship(back_populates="zones")

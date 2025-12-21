from pydantic import BaseModel, ConfigDict

from app.schemas.irrigation import (
    LocalCorrectionFactors,
    FrequencySettings,
    FallbackStrategy,
    IrrigationConfigurationEvenArea,
    IrrigationConfigurationPerPlant
)

from app.schemas.emitters import (
    EmittersConfigurationEvenArea,
    EmittersConfigurationPerPlant
)

from app.domain.domain import IrrigationMode


class ZoneRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    relay_pin: int
    enabled: bool
    irrigation_mode: IrrigationMode
    local_correction_factors: LocalCorrectionFactors
    frequency_settings: FrequencySettings
    fallback_strategy: FallbackStrategy
    irrigation_configuration: IrrigationConfigurationEvenArea | IrrigationConfigurationPerPlant
    emitters_configuration: EmittersConfigurationEvenArea | EmittersConfigurationPerPlant


class ZoneCreate(BaseModel):
    name: str
    relay_pin: int
    enabled: bool
    irrigation_mode: IrrigationMode
    local_correction_factors: LocalCorrectionFactors
    frequency_settings: FrequencySettings
    fallback_strategy: FallbackStrategy
    irrigation_configuration: IrrigationConfigurationEvenArea | IrrigationConfigurationPerPlant
    emitters_configuration: EmittersConfigurationEvenArea | EmittersConfigurationPerPlant


class ZoneUpdate(BaseModel):
    name: str | None = None
    relay_pin: int | None = None
    enabled: bool | None = None
    local_correction_factors: LocalCorrectionFactors | None = None
    frequency_settings: FrequencySettings | None = None
    fallback_strategy: FallbackStrategy | None = None
    irrigation_configuration: IrrigationConfigurationEvenArea | IrrigationConfigurationPerPlant | None = None
    emitters_configuration: EmittersConfigurationEvenArea | EmittersConfigurationPerPlant | None = None


class ZoneListRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    relay_pin: int
    enabled: bool
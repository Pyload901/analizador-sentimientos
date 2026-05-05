from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional, List
from enum import Enum

class SentimientoEnum(str, Enum):
    positivo = "positivo"
    negativo = "negativo"
    neutro = "neutro"

class TemaEnum(str, Enum):
    servicio = "Servicio al Cliente"
    calidad = "Calidad del Producto"
    precio = "Precio"
    limpieza = "Limpieza"
    otro = "Otro"

class MensajeBase(BaseModel):
    texto_mensaje: str
    numero_remitente: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MensajeIA(BaseModel):
    sentimiento: SentimientoEnum
    tema: TemaEnum
    resumen: str

class MensajeDB(MensajeBase):
    id: str = Field(alias="_id")
    sentimiento: Optional[SentimientoEnum] = None
    tema: Optional[TemaEnum] = None
    resumen: Optional[str] = None

class AnalisisResponse(BaseModel):
    sentimiento: str
    tema: str
    resumen: str

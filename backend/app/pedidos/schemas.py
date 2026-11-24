from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Literal
from datetime import datetime

EstadoPedidoValido = Literal[
    "PENDIENTE",
    "CONFIRMADO",
    "EN_PREPARACION",
    "ENVIADO",
    "ENTREGADO",
    "CANCELADO"
]

class DetallePedidoCreate(BaseModel):
    producto_id: int = Field(..., gt=0)
    cantidad: int = Field(..., gt=0)

class DetallePedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    pedido_id: int
    producto_id: int
    cantidad: int
    precio_unitario: float

class PedidoCreate(BaseModel):
    detalles: List[DetallePedidoCreate] = Field(..., min_length=1)
    direccion_entrega_id: Optional[int] = None
    forma_pago_id: Optional[int] = None

class PedidoUpdateEstado(BaseModel):
    estado: EstadoPedidoValido

class PedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: Optional[int] = None
    fecha: datetime
    estado: str
    total: float

class PedidoReadFull(PedidoRead):
    detalles: List[DetallePedidoRead] = []

class CatalogoItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nombre: str
    descripcion: Optional[str] = None

class DireccionEntregaCreate(BaseModel):
    calle: str = Field(..., min_length=1)
    numero: str = Field(..., min_length=1)
    piso_depto: Optional[str] = None
    ciudad: str = Field(..., min_length=1)
    codigo_postal: Optional[str] = None

class DireccionEntregaRead(DireccionEntregaCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    usuario_id: int
    created_at: datetime

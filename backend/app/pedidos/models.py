from typing import Optional, List
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Relationship

class FormaPago(SQLModel, table=True):
    __tablename__ = "forma_pago"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True)
    descripcion: Optional[str] = None

class EstadoPedido(SQLModel, table=True):
    __tablename__ = "estado_pedido"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True)
    descripcion: Optional[str] = None

class DireccionEntrega(SQLModel, table=True):
    __tablename__ = "direccion_entrega"

    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    calle: str
    numero: str
    piso_depto: Optional[str] = None
    ciudad: str
    codigo_postal: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = Field(default=None, nullable=True)

class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalle_pedido"

    pedido_id: int = Field(foreign_key="pedido.id", primary_key=True)
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    cantidad: int = Field(ge=1)
    precio_unitario: float = Field(ge=0)

    pedido: Optional["Pedido"] = Relationship(back_populates="detalles")

class Pedido(SQLModel, table=True):
    __tablename__ = "pedido"

    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: Optional[int] = Field(default=None, foreign_key="usuario.id", nullable=True)
    direccion_entrega_id: Optional[int] = Field(default=None, foreign_key="direccion_entrega.id", nullable=True)
    forma_pago_id: Optional[int] = Field(default=None, foreign_key="forma_pago.id", nullable=True)
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    estado: str = Field(default="PENDIENTE")
    total: float = Field(default=0.0, ge=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = Field(default=None, nullable=True)

    detalles: List[DetallePedido] = Relationship(back_populates="pedido", cascade_delete=True)

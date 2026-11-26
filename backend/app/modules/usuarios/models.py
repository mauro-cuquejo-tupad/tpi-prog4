from typing import Optional, List, TYPE_CHECKING
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum

if TYPE_CHECKING:
    from app.modules.pedidos.models import Pedido
    
class RolUsuario(str, Enum):
    ADMIN = "admin"
    USER = "user"

class Usuario(SQLModel, table=True):
    __tablename__ = "usuario"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True, nullable=False)
    full_name: str
    email: str = Field(unique=True, index=True, nullable=False)    
    hashed_password: str
    role: RolUsuario = Field(default=RolUsuario.USER)
    disabled: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None))

    pedidos: List["Pedido"] = Relationship(back_populates="usuario")
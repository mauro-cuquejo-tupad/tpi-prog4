from typing import Optional, List
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Relationship

class Rol(SQLModel, table=True):
    __tablename__ = "rol"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True)
    descripcion: str

    usuarios: List["UsuarioRol"] = Relationship(back_populates="rol")


class UsuarioRol(SQLModel, table=True):
    __tablename__ = "usuario_rol"

    usuario_id: int = Field(foreign_key="usuario.id", primary_key=True)
    rol_id: int = Field(foreign_key="rol.id", primary_key=True)
    asignado_por_id: Optional[int] = Field(default=None, foreign_key="usuario.id", nullable=True)
    expires_at: Optional[datetime] = Field(default=None, nullable=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    usuario: Optional["Usuario"] = Relationship(
        back_populates="roles_asignados",
        sa_relationship_kwargs={"foreign_keys": "UsuarioRol.usuario_id"}
    )
    rol: Optional[Rol] = Relationship(back_populates="usuarios")


class Usuario(SQLModel, table=True):
    __tablename__ = "usuario"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    apellido: str
    email: str = Field(unique=True, index=True)
    celular: Optional[str] = Field(default=None, nullable=True)
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = Field(default=None, nullable=True)

    roles_asignados: List[UsuarioRol] = Relationship(
        back_populates="usuario",
        sa_relationship_kwargs={"foreign_keys": "UsuarioRol.usuario_id"}
    )

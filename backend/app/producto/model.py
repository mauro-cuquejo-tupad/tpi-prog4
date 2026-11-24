from typing import Optional, List
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column, Integer, ForeignKey, Relationship
from sqlalchemy import Column as SaColumn, JSON

class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"
    producto_id: int = Field(sa_column=Column(Integer, ForeignKey("producto.id", ondelete="CASCADE"), primary_key=True, nullable=False))
    categoria_id: int = Field(sa_column=Column(Integer, ForeignKey("categoria.id", ondelete="CASCADE"), primary_key=True, nullable=False))
    es_principal: bool = Field(default=False)

class Producto(SQLModel, table=True):
    __tablename__ = "producto"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True)
    descripcion: str
    precio_base: float = Field(ge=0)
    imagenes_url: list[str] = Field(default_factory=list, sa_column=SaColumn(JSON))
    disponible: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = Field(default=None, nullable=True)

    categorias: List["Categoria"] = Relationship(back_populates="productos", link_model=ProductoCategoria)

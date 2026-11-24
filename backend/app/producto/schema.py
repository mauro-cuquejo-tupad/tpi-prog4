from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

class ProductoBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nombre: str = Field(..., example="Silla de Oficina", min_length=1)    
    descripcion: str = Field(..., example="Silla ergonómica ajustable", min_length=1)
    precio_base: float = Field(ge=0, example=150.50)
    imagenes_url: List[str] = Field(default_factory=list)
    disponible: bool = True

class ProductoRead(ProductoBase):
    id: int
    
class ProductoCreate(ProductoBase):
    pass

class CategoriaIdBody(BaseModel):
    categoria_id: int
    es_principal: bool = False

class CategoriaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: str

class CategoriaBasicRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str

class ProductoFullRead(ProductoRead):
    categorias: List[CategoriaBasicRead] = []

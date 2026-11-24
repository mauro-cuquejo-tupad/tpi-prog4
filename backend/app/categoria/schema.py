from pydantic import BaseModel, ConfigDict, Field, StringConstraints
from typing_extensions import Annotated

NonEmptyStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]

class CategoriaBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nombre: NonEmptyStr
    descripcion: str = Field(default="", example="Muebles de Oficina")

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaRead(CategoriaBase):
    id: int

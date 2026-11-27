from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, StringConstraints
from typing_extensions import Annotated

NonEmptyStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]

class CategoriaBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nombre: NonEmptyStr
    descripcion: Optional[str] = None

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(BaseModel):
    nombre: Optional[NonEmptyStr] = None
    descripcion: Optional[str] = None

class CategoriaRead(CategoriaBase):
    id: int
    activo: bool

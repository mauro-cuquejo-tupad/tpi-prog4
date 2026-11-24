from pydantic import BaseModel, ConfigDict, StringConstraints
from typing_extensions import Annotated
from typing import Optional

NonEmptyStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]

class IngredienteBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    nombre: NonEmptyStr

class IngredienteCreate(IngredienteBase):
    pass

class IngredienteRead(IngredienteBase):
    id: int

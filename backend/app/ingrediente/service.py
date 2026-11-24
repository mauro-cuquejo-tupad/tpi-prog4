from typing import List
from sqlmodel import Session
from fastapi import HTTPException, status
from app.ingrediente.model import Ingrediente
from app.ingrediente.schema import IngredienteCreate, IngredienteRead
from app.ingrediente import repository as repo

def crear(data: IngredienteCreate, session: Session) -> IngredienteRead:
    if repo.get_by_nombre(data.nombre, session):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un ingrediente con el nombre '{data.nombre}'"
        )
    nuevo = Ingrediente(nombre=data.nombre.strip())
    repo.save_ingrediente(nuevo, session)
    return IngredienteRead.model_validate(nuevo)

def obtener_todos(skip: int = 0, limit: int = 100, session: Session = None) -> List[IngredienteRead]:
    ingredientes = repo.get_all(skip, limit, session)
    return [IngredienteRead.model_validate(i) for i in ingredientes]

def obtener_por_id(id: int, session: Session) -> IngredienteRead:
    ingrediente = repo.get_by_id(id, session)
    if not ingrediente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El ingrediente con id {id} no existe"
        )
    return IngredienteRead.model_validate(ingrediente)

def actualizar_total(id: int, data: IngredienteCreate, session: Session) -> IngredienteRead:
    ingrediente = repo.get_by_id(id, session)
    if not ingrediente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El ingrediente con id {id} no existe"
        )

    existente = repo.get_by_nombre(data.nombre, session)
    if existente and existente.id != id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe otro ingrediente con el nombre '{data.nombre}'"
        )

    ingrediente.nombre = data.nombre.strip()
    repo.save_ingrediente(ingrediente, session)
    return IngredienteRead.model_validate(ingrediente)

def eliminar(id: int, session: Session) -> None:
    ingrediente = repo.get_by_id(id, session)
    if not ingrediente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El ingrediente con id {id} no existe"
        )
    repo.delete_ingrediente(ingrediente, session)

from typing import List, Optional
from .schema import CategoriaCreate, CategoriaRead
from sqlmodel import Session
from app.categoria import repository as repo
from fastapi import status
from fastapi.exceptions import HTTPException
from app.categoria.model import Categoria

def crear(data: CategoriaCreate, session: Session) -> CategoriaRead:
    if repo.get_by_nombre(data.nombre, session):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"La categoría de nombre {data.nombre} ya existe"
        )

    nueva = Categoria(**data.model_dump())
    repo.save_categoria(nueva, session)
    return CategoriaRead.model_validate(nueva)

def obtener_todas(skip: int = 0, limit: int = 10, session: Session = None) -> List[CategoriaRead]:
    return [CategoriaRead.model_validate(c) for c in repo.get_all(skip, limit, session)]

def obtener_por_id(id: int, session: Session) -> CategoriaRead:
    categoria = repo.get_by_id(id, session)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La categoría de id {id} no existe"
        )
    return CategoriaRead.model_validate(categoria)

def actualizar_total(id: int, data: CategoriaCreate, session: Session) -> CategoriaRead:
    categoria = repo.get_by_id(id, session)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La categoría de id {id} no existe"
        )

    categoria_existente = repo.get_by_nombre(data.nombre, session)
    if categoria_existente and categoria_existente.id != id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"La categoría con el nombre '{data.nombre}' ya existe"
        )

    categoria_actualizada = data.model_dump(exclude_unset=True)
    for key, value in categoria_actualizada.items():
        setattr(categoria, key, value)

    repo.save_categoria(categoria, session)
    return CategoriaRead.model_validate(categoria)

def eliminar(id: int, session: Session) -> None:
    categoria = repo.get_by_id(id, session)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La categoría de id {id} no existe"
        )

    repo.soft_delete_categoria(categoria, session)

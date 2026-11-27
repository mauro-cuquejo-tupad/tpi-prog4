from app.modules.categorias.schemas import CategoriaUpdate
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork
from typing import List, Optional
from .schemas import CategoriaCreate, CategoriaRead
from sqlmodel import Session
from app.modules.categorias import repository as repo
from fastapi import status
from fastapi.exceptions import HTTPException
from app.modules.categorias.models import Categoria


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork):
        self.uow = uow

    def listar_activas(self) -> List[CategoriaRead]:
        with self.uow as uow:
            categorias = uow.categorias.list_activas()
            return [CategoriaRead.model_validate(c) for c in categorias]

    def obtener_por_id(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            cat = uow.categorias.get_by_id(categoria_id)
            if not cat or not cat.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Categoría con id {categoria_id} no encontrada."
                )
            return CategoriaRead.model_validate(cat)

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            if uow.categorias.get_by_nombre(data.nombre):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe una categoría con el nombre '{data.nombre}'."
                )
            nueva = Categoria(
                nombre=data.nombre,
                descripcion=data.descripcion,
                activo=True
            )
            uow.categorias.add(nueva)
            return CategoriaRead.model_validate(nueva)

    def actualizar(self, categoria_id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            cat = uow.categorias.get_by_id(categoria_id)
            if not cat or not cat.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Categoría con id {categoria_id} no encontrada."
                )
            if data.nombre and data.nombre != cat.nombre:
                existente = uow.categorias.get_by_nombre(data.nombre)
                if existente and existente.id != categoria_id:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail=f"Ya existe una categoría con el nombre '{data.nombre}'."
                    )
                cat.nombre = data.nombre
            if data.descripcion is not None:
                cat.descripcion = data.descripcion

            return CategoriaRead.model_validate(cat)

    def eliminar_logico(self, categoria_id: int) -> None:
        with self.uow as uow:
            cat = uow.categorias.get_by_id(categoria_id)
            if not cat or not cat.activo:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Categoría con id {categoria_id} no encontrada."
                )
            cat.activo = False
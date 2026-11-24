from app.producto.schema import ProductoFullRead
from typing import List
from sqlmodel import Session
from fastapi import HTTPException, status
from app.producto.model import Producto
from app.producto.schema import ProductoCreate, ProductoRead
from app.producto import repository as repo
from app.categoria import repository as categoria_repo

def crear(data: ProductoCreate, session: Session) -> ProductoRead:
    if repo.get_by_nombre(data.nombre, session):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un producto con el nombre '{data.nombre}'"
        )

    nuevo = Producto(**data.model_dump())
    repo.save_producto(nuevo, session)
    return ProductoRead.model_validate(nuevo)

def obtener_todos(skip: int, limit: int, session: Session) -> List[ProductoFullRead]:
    productos = repo.get_all(skip, limit, session)
    return [ProductoFullRead.model_validate(p) for p in productos]

def obtener_por_id(id: int, session: Session) -> ProductoFullRead:
    producto = repo.get_by_id(id, session)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto de id {id} no existe"
        )
    return ProductoFullRead.model_validate(producto)

def actualizar_total(id: int, data: ProductoCreate, session: Session) -> ProductoRead:
    producto = repo.get_by_id(id, session)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto de id {id} no existe"
        )
    
    producto_existente = repo.get_by_nombre(data.nombre, session)
    if producto_existente and producto_existente.id != id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe otro producto con el nombre '{data.nombre}'"
        )

    producto_actualizado = data.model_dump(exclude_unset=True)
    for key, value in producto_actualizado.items():
        setattr(producto, key, value)

    repo.save_producto(producto, session)
    return ProductoRead.model_validate(producto)

def eliminar(id: int, session: Session) -> None:
    producto = repo.get_by_id(id, session)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto de id {id} no existe"
        )

    repo.soft_delete_producto(producto, session)

def agregar_categoria(producto_id: int, categoria_id: int, es_principal: bool, session: Session) -> ProductoFullRead:
    producto = repo.get_by_id(producto_id, session)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto de id {producto_id} no existe"
        )
    
    categoria = categoria_repo.get_by_id(categoria_id, session)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La categoría de id {categoria_id} no existe"
        )

    if any(c.id == categoria_id for c in producto.categorias):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"El producto de id {producto_id} ya tiene la categoría de id {categoria_id}"
        )

    repo.add_categoria_to_producto(producto, categoria, es_principal, session)
    return ProductoFullRead.model_validate(producto)

def quitar_categoria(producto_id: int, categoria_id: int, session: Session) -> None:
    producto = repo.get_by_id(producto_id, session)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto de id {producto_id} no existe"
        )
    
    categoria = categoria_repo.get_by_id(categoria_id, session)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La categoría de id {categoria_id} no existe"
        )

    cat_asignada = next((c for c in producto.categorias if c.id == categoria_id), None)
    if not cat_asignada:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"El producto de id {producto_id} no tiene asignada la categoría de id {categoria_id}"
        )

    repo.remove_categoria_from_producto(producto, categoria, session)

def listar_categorias_de_producto(producto_id: int, session: Session) -> List[categoria_repo.Categoria]:
    producto = repo.get_by_id(producto_id, session)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El producto de id {producto_id} no existe"
        )
    return [c for c in producto.categorias if c.deleted_at is None]

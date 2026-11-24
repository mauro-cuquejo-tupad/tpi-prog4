from fastapi import APIRouter, HTTPException, Path, Query, status, Depends
from typing import List, Annotated
from sqlmodel import Session
from app.core.database import get_session
from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.schemas import UserPublic
from . import schema, service

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.post("/", response_model=schema.ProductoRead, status_code=status.HTTP_201_CREATED)
def alta_producto(
    producto: schema.ProductoCreate,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    session: Session = Depends(get_session)
):
    return service.crear(producto, session)

@router.get("/", response_model=List[schema.ProductoFullRead], status_code=status.HTTP_200_OK)
def listar_productos(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50),
    session: Session = Depends(get_session)
):
    return service.obtener_todos(skip, limit, session)

@router.get("/{id}", response_model=schema.ProductoFullRead, status_code=status.HTTP_200_OK)
def detalle_producto(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    return service.obtener_por_id(id, session)

@router.put("/{id}", response_model=schema.ProductoRead, status_code=status.HTTP_200_OK)
def actualizar_producto(
    producto: schema.ProductoCreate,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    return service.actualizar_total(id, producto, session)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    service.eliminar(id, session)

@router.post("/{id}/categorias", response_model=schema.ProductoFullRead, status_code=status.HTTP_201_CREATED)
def asignar_categoria(
    body: schema.CategoriaIdBody,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    return service.agregar_categoria(id, body.categoria_id, body.es_principal, session)

@router.get("/{id}/categorias", response_model=List[schema.CategoriaRead], status_code=status.HTTP_200_OK)
def listar_categorias_producto(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    return service.listar_categorias_de_producto(id, session)

@router.delete("/{id}/categorias/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def quitar_categoria(
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
    categoria_id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    service.quitar_categoria(id, categoria_id, session)

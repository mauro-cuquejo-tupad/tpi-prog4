from fastapi import APIRouter, Path, Query, status, Depends
from typing import List, Annotated
from . import schema, service
from app.core.database import get_session
from sqlmodel import Session
from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.schemas import UserPublic

router = APIRouter(prefix="/categorias", tags=["Categorías"])

@router.post("/", response_model=schema.CategoriaRead, status_code=status.HTTP_201_CREATED)
def alta_categoria(
    categoria: schema.CategoriaCreate,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    session: Session = Depends(get_session)
):
    return service.crear(categoria, session)

@router.get("/", response_model=List[schema.CategoriaRead], status_code=status.HTTP_200_OK)
def listar_categorias(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50),
    session: Session = Depends(get_session)
):
    return service.obtener_todas(skip, limit, session)

@router.get("/{id}", response_model=schema.CategoriaRead, status_code=status.HTTP_200_OK)
def detalle_categoria(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    return service.obtener_por_id(id, session)

@router.put("/{id}", response_model=schema.CategoriaRead, status_code=status.HTTP_200_OK)
def actualizar_categoria(
    categoria: schema.CategoriaCreate,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    return service.actualizar_total(id, categoria, session)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    service.eliminar(id, session)

from fastapi import APIRouter, Path, Query, status, Depends
from typing import List, Annotated
from sqlmodel import Session
from app.core.database import get_session
from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.schemas import UserPublic
from app.ingrediente import schema, service

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

@router.post("", response_model=schema.IngredienteRead, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schema.IngredienteRead, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def alta_ingrediente(
    ingrediente: schema.IngredienteCreate,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    session: Session = Depends(get_session)
):
    return service.crear(ingrediente, session)

@router.get("", response_model=List[schema.IngredienteRead], status_code=status.HTTP_200_OK)
@router.get("/", response_model=List[schema.IngredienteRead], status_code=status.HTTP_200_OK, include_in_schema=False)
def listar_ingredientes(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=200),
    session: Session = Depends(get_session)
):
    return service.obtener_todos(skip, limit, session)

@router.get("/{id}", response_model=schema.IngredienteRead, status_code=status.HTTP_200_OK)
def detalle_ingrediente(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    return service.obtener_por_id(id, session)

@router.put("/{id}", response_model=schema.IngredienteRead, status_code=status.HTTP_200_OK)
def actualizar_ingrediente(
    ingrediente: schema.IngredienteCreate,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    return service.actualizar_total(id, ingrediente, session)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ingrediente(
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
    session: Session = Depends(get_session)
):
    service.eliminar(id, session)

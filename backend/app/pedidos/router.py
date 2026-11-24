from fastapi import APIRouter, HTTPException, Path, Query, status, Depends
from typing import List, Annotated
from app.pedidos.schemas import (
    PedidoCreate,
    PedidoRead,
    PedidoReadFull,
    PedidoUpdateEstado,
    DireccionEntregaCreate,
    DireccionEntregaRead,
    CatalogoItemRead,
)
from app.pedidos.service import (
    PedidoService,
    ProductoNoEncontrado,
    PedidoNoEncontrado,
    PedidoEstadoInvalido
)
from app.pedidos.unit_of_work import PedidoUnitOfWork
from app.core.database import session_factory
from app.core.deps import get_current_active_user, require_role
from app.modules.usuarios.schemas import UserPublic

router = APIRouter(prefix="/pedidos", tags=["pedidos"])

def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork(session_factory))

def pedido_no_encontrado() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")

@router.get("", response_model=List[PedidoRead], status_code=status.HTTP_200_OK)
@router.get("/", response_model=List[PedidoRead], status_code=status.HTTP_200_OK, include_in_schema=False)
def listar_pedidos(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=200),
    service: PedidoService = Depends(get_pedido_service)
):
    return service.listar(skip=skip, limit=limit)

@router.get("/catalogos/formas-pago", response_model=List[CatalogoItemRead], status_code=status.HTTP_200_OK)
def listar_formas_pago(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    service: PedidoService = Depends(get_pedido_service)
):
    return service.listar_formas_pago()

@router.get("/catalogos/estados-pedido", response_model=List[CatalogoItemRead], status_code=status.HTTP_200_OK)
def listar_estados_pedido(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    service: PedidoService = Depends(get_pedido_service)
):
    return service.listar_estados_pedido()

@router.post("/direcciones", response_model=DireccionEntregaRead, status_code=status.HTTP_201_CREATED)
def crear_direccion(
    data: DireccionEntregaCreate,
    user: Annotated[UserPublic, Depends(require_role(["user", "admin"]))],
    service: PedidoService = Depends(get_pedido_service)
):
    return service.crear_direccion(data, usuario_id=user.id)

@router.get("/direcciones", response_model=List[DireccionEntregaRead], status_code=status.HTTP_200_OK)
def listar_direcciones(
    user: Annotated[UserPublic, Depends(get_current_active_user)],
    service: PedidoService = Depends(get_pedido_service)
):
    return service.listar_direcciones(usuario_id=user.id)

@router.get("/{id}", response_model=PedidoReadFull, status_code=status.HTTP_200_OK)
def obtener_pedido(
    _user: Annotated[UserPublic, Depends(get_current_active_user)],
    id: int = Path(..., gt=0),
    service: PedidoService = Depends(get_pedido_service)
):
    try:
        return service.obtener_por_id(id)
    except PedidoNoEncontrado:
        raise pedido_no_encontrado()

@router.post("", response_model=PedidoReadFull, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=PedidoReadFull, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def crear_pedido(
    data: PedidoCreate,
    user: Annotated[UserPublic, Depends(require_role(["user", "admin"]))],
    service: PedidoService = Depends(get_pedido_service)
):
    try:
        return service.crear(data, usuario_id=user.id)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{id}", response_model=PedidoReadFull, status_code=status.HTTP_200_OK)
def actualizar_estado_pedido(
    data: PedidoUpdateEstado,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
    service: PedidoService = Depends(get_pedido_service)
):
    try:
        return service.actualizar_estado(id, data)
    except PedidoNoEncontrado:
        raise pedido_no_encontrado()
    except PedidoEstadoInvalido as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pedido(
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
    service: PedidoService = Depends(get_pedido_service)
):
    try:
        service.eliminar(id)
    except PedidoNoEncontrado:
        raise pedido_no_encontrado()

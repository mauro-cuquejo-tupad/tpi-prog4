from app.modules.categorias.schemas import CategoriaCreate
from app.modules.categorias.schemas import CategoriaRead, CategoriaUpdate
from app.modules.categorias.service import CategoriaService
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork, get_categoria_uow
from app.modules.usuarios.schemas import UserPublic
from app.core.deps import require_role
from fastapi import APIRouter, status, Depends, Response
from typing import List, Annotated

router = APIRouter(prefix="/categorias", tags=["Categorías"])

def get_categoria_service(uow: Annotated[CategoriaUnitOfWork, Depends(get_categoria_uow)]) -> CategoriaService:
    return CategoriaService(uow)

ServicioCategoria = Annotated[CategoriaService, Depends(get_categoria_service)]
SoloAdmin = Annotated[UserPublic, Depends(require_role(["admin"]))]   

# Lecturas públicas
@router.get("", response_model=List[CategoriaRead])
def listar_categorias(service: ServicioCategoria):
    return service.listar_activas()

@router.get("/{id}", response_model=CategoriaRead)
def detalle_categoria(id: int, service: ServicioCategoria):
    return service.obtener_por_id(id)

# Escrituras sólo admin
@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(data: CategoriaCreate, _admin: SoloAdmin, service: ServicioCategoria):
    return service.crear(data)

@router.put("/{id}", response_model=CategoriaRead)
def actualizar_categoria(id: int, data: CategoriaUpdate, _admin: SoloAdmin, service: ServicioCategoria):
    return service.actualizar(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(id: int, _admin: SoloAdmin, service: ServicioCategoria):
    service.eliminar_logico(id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
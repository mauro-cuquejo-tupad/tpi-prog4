from typing import Annotated, List
from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.deps import get_current_active_user, require_role, get_usuario_service
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.service import UsuarioService

router = APIRouter(prefix="/auth", tags=["Autenticación"])

ServicioUsuario = Annotated[UsuarioService, Depends(get_usuario_service)]
SoloAdmin = Annotated[UserPublic, Depends(require_role(["admin"]))]

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(
    data: UserCreate,
    service: ServicioUsuario,
):
    return service.register(data)

@router.post("/token")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: ServicioUsuario,
    response: Response,
):
    token_str = service.authenticate(form_data.username, form_data.password)
    response.set_cookie(
        key="access_token",
        value=token_str,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False,
    )
    return {"mensaje": "Login exitoso. Sesión iniciada."}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
    )
    return {"mensaje": "Sesión cerrada exitosamente"}

@router.get("/me", response_model=UserPublic)
def get_me(
    current_user: Annotated[UserPublic, Depends(get_current_active_user)]
):
    return current_user

@router.get("/admin/usuarios", response_model=List[UserPublic])
def list_usuarios_admin(
    _admin: SoloAdmin,
    service: ServicioUsuario,
):
    return service.list_all_admin()

@router.post("/admin/usuarios/{id}/activar", response_model=UserPublic)
def activar_usuario(
    id: int,
    _admin: SoloAdmin,
    service: ServicioUsuario,
):
    return service.activar(id)

@router.post("/admin/usuarios/{id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    id: int,
    _admin: SoloAdmin,
    service: ServicioUsuario,
):
    return service.desactivar(id)

from typing import Annotated, List
from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.deps import get_current_active_user, require_role, get_usuario_service
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.service import UsuarioService

auth_router = APIRouter(prefix="/auth", tags=["Autenticación"])
admin_usuarios_router = APIRouter(prefix="/admin/usuarios", tags=["Admin Usuarios"])

ServicioUsuario = Annotated[UsuarioService, Depends(get_usuario_service)]
SoloAdmin = Annotated[UserPublic, Depends(require_role(["admin"]))]

# -- Endpoints de Auth (/api/v1/auth)

@auth_router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, service: ServicioUsuario):
    return service.register(data)

@auth_router.post("/token")
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
    return {"mensaje": "Login exitoso."}

@auth_router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token",httponly=True,samesite="lax")
    return {"mensaje": "Sesión cerrada exitosamente"}

@auth_router.get("/me", response_model=UserPublic)
def get_me(current_user: Annotated[UserPublic, Depends(get_current_active_user)]):
    return current_user


# -- Enpoints de Admin Usuarios (/api/v1/admin/usuarios)

@admin_usuarios_router.get("/", response_model=List[UserPublic])
def list_usuarios_admin(_admin: SoloAdmin, service: ServicioUsuario):
    return service.list_all()

@admin_usuarios_router.post("/{id}/activar", response_model=UserPublic)
def activar_usuario(id: int, _admin: SoloAdmin, service: ServicioUsuario):
    return service.activar(id)

@admin_usuarios_router.post("/{id}/desactivar", response_model=UserPublic)
def desactivar_usuario(id: int, admin: SoloAdmin, service: ServicioUsuario):
    return service.desactivar(id, admin.id)

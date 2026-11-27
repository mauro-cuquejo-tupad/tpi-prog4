from time import timezone
from datetime import datetime
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork
from typing import List, Optional
from fastapi import HTTPException, status
from app.core.security import hash_password, verify_password, create_access_token
from app.modules.usuarios.models import Usuario, RolUsuario
from app.modules.usuarios.schemas import UserCreate, UserPublic

class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def register(self, data: UserCreate) -> UserPublic:
        with self.uow as uow:
            #409 si username o email ya existen            
            if uow.usuarios.get_by_username(data.username):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"El nombre de usuario '{data.username}' ya está registrado."
                )
            
            if uow.usuarios.get_by_email(data.email):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"El correo electrónico '{data.email}' ya está registrado."
                )

            nuevo_usuario = Usuario(
                username=data.username,
                full_name=data.full_name,
                email=data.email,
                hashed_password=hash_password(data.password),
                role=RolUsuario.USER,
                disabled=False,
                created_at=datetime.now(timezone.utc)
            )
            uow.usuarios.add(nuevo_usuario)
            return UserPublic.model_validate(nuevo_usuario)

    def authenticate(self, username: str, password: str) -> str:
        with self.uow as uow:
            user = uow.usuarios.get_by_username(username)
            if not user or not verify_password(password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales incorrectas",
                    headers={"WWW-Authenticate": "Bearer"}
                )

            if user.disabled:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cuenta de usuario desactivada"
                )

            
            return create_access_token(data={"sub": user.username, "role": user.role})
            

    def get_by_username(self, username: str) -> Optional[UserPublic]:
        with self.uow as uow:
            user = uow.usuarios.get_by_username(username)
            if not user:
                return None            
            return UserPublic.model_validate(user)

    def list_all(self) -> List[UserPublic]:
        with self.uow as uow:
            usuarios = uow.usuarios.list_all_admin()            
            return [UserPublic.model_validate(u) for u in usuarios]

    def activar(self, user_id: int) -> UserPublic:
        with self.uow as uow:
            user = uow.usuarios.get_by_id(user_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuario con id {user_id} no encontrado"
                )
            user.disabled = False            
            return UserPublic.model_validate(user)

    def desactivar(self, user_id: int, current_user_id: int) -> UserPublic:
        with self.uow as uow:
            if user_id == current_user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="El usuario no puede desactivarse a sí mismo."
                )   
            user = uow.usuarios.get_by_id(user_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuario con id {user_id} no encontrado"
                )
            user.disabled = True
            return UserPublic.model_validate(user)

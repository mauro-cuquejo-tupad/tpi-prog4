from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException, status
from app.core.security import hash_password, verify_password, create_access_token
from app.core.uow import UnitOfWork
from app.modules.usuarios.model import Usuario, Rol
from app.modules.usuarios.schemas import UserCreate, UserPublic

class UsuarioService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def register(self, data: UserCreate) -> UserPublic:
        with self.uow:
            existente = self.uow.usuarios.get_by_email(data.email)
            if existente:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Ya existe un usuario con el email '{data.email}'"
                )

            rol_user = self.uow.usuarios.get_rol_by_nombre("user")
            if not rol_user:
                rol_user = Rol(nombre="user", descripcion="Usuario estándar")
                self.uow.usuarios.save_rol(rol_user)

            now = datetime.now(timezone.utc)
            nuevo_usuario = Usuario(
                nombre=data.nombre,
                apellido=data.apellido,
                email=data.email,
                celular=data.celular,
                password_hash=hash_password(data.password),
                created_at=now,
                updated_at=now,
                deleted_at=None
            )
            self.uow.usuarios.save(nuevo_usuario)
            self.uow.usuarios.add_rol_to_user(usuario_id=nuevo_usuario.id, rol_id=rol_user.id)

            roles_vigentes = self.uow.usuarios.get_user_roles_vigentes(nuevo_usuario.id)
            user_dict = nuevo_usuario.model_dump()
            user_dict["roles"] = roles_vigentes
            return UserPublic.model_validate(user_dict)

    def authenticate(self, email: str, password: str) -> str:
        with self.uow:
            user = self.uow.usuarios.get_by_email(email)
            if not user or not verify_password(password, user.password_hash):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales incorrectas",
                    headers={"WWW-Authenticate": "Bearer"}
                )

            if user.deleted_at is not None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cuenta de usuario desactivada"
                )

            roles_vigentes = self.uow.usuarios.get_user_roles_vigentes(user.id)
            token = create_access_token(data={"sub": user.email, "roles": roles_vigentes})
            return token

    def get_public_user_by_email(self, email: str) -> Optional[UserPublic]:
        with self.uow:
            user = self.uow.usuarios.get_by_email(email)
            if not user:
                return None
            roles_vigentes = self.uow.usuarios.get_user_roles_vigentes(user.id)
            user_dict = user.model_dump()
            user_dict["roles"] = roles_vigentes
            return UserPublic.model_validate(user_dict)

    def list_all_admin(self) -> List[UserPublic]:
        with self.uow:
            usuarios = self.uow.usuarios.list_all(include_deleted=True)
            resultado = []
            for u in usuarios:
                roles = self.uow.usuarios.get_user_roles_vigentes(u.id)
                d = u.model_dump()
                d["roles"] = roles
                resultado.append(UserPublic.model_validate(d))
            return resultado

    def activar(self, user_id: int) -> UserPublic:
        with self.uow:
            user = self.uow.usuarios.get_by_id(user_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuario con id {user_id} no encontrado"
                )
            user.deleted_at = None
            user.updated_at = datetime.now(timezone.utc)
            self.uow.usuarios.save(user)
            roles = self.uow.usuarios.get_user_roles_vigentes(user.id)
            d = user.model_dump()
            d["roles"] = roles
            return UserPublic.model_validate(d)

    def desactivar(self, user_id: int) -> UserPublic:
        with self.uow:
            user = self.uow.usuarios.get_by_id(user_id)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuario con id {user_id} no encontrado"
                )
            user.deleted_at = datetime.now(timezone.utc)
            user.updated_at = datetime.now(timezone.utc)
            self.uow.usuarios.save(user)
            roles = self.uow.usuarios.get_user_roles_vigentes(user.id)
            d = user.model_dump()
            d["roles"] = roles
            return UserPublic.model_validate(d)

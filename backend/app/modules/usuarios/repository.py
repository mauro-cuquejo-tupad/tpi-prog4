from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import Session, select
from app.modules.usuarios.model import Usuario, Rol, UsuarioRol

class UsuarioRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, user_id: int) -> Optional[Usuario]:
        return self.session.get(Usuario, user_id)

    def get_by_email(self, email: str) -> Optional[Usuario]:
        statement = select(Usuario).where(Usuario.email == email)
        return self.session.exec(statement).first()

    def list_all(self, include_deleted: bool = False) -> List[Usuario]:
        statement = select(Usuario)
        if not include_deleted:
            statement = statement.where(Usuario.deleted_at.is_(None))
        return list(self.session.exec(statement).all())

    def save(self, usuario: Usuario) -> Usuario:
        self.session.add(usuario)
        self.session.flush()
        return usuario

    def get_rol_by_nombre(self, nombre: str) -> Optional[Rol]:
        statement = select(Rol).where(Rol.nombre == nombre)
        return self.session.exec(statement).first()

    def list_roles(self) -> List[Rol]:
        statement = select(Rol)
        return list(self.session.exec(statement).all())

    def save_rol(self, rol: Rol) -> Rol:
        self.session.add(rol)
        self.session.flush()
        return rol

    def get_user_roles_vigentes(self, usuario_id: int) -> List[str]:
        now = datetime.now(timezone.utc)
        statement = (
            select(Rol.nombre)
            .join(UsuarioRol, UsuarioRol.rol_id == Rol.id)
            .where(UsuarioRol.usuario_id == usuario_id)
            .where(
                (UsuarioRol.expires_at.is_(None)) | (UsuarioRol.expires_at > now)
            )
        )
        return list(self.session.exec(statement).all())

    def add_rol_to_user(
        self,
        usuario_id: int,
        rol_id: int,
        asignado_por_id: Optional[int] = None,
        expires_at: Optional[datetime] = None
    ) -> UsuarioRol:
        enlace = UsuarioRol(
            usuario_id=usuario_id,
            rol_id=rol_id,
            asignado_por_id=asignado_por_id,
            expires_at=expires_at,
            created_at=datetime.now(timezone.utc)
        )
        self.session.add(enlace)
        self.session.flush()
        return enlace

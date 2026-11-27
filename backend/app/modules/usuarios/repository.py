from app.core.base_repository import BaseRepository
from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import Session, select
from app.modules.usuarios.models import Usuario

class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session):
        super().__init__(session, Usuario)

    def get_by_username(self, username: str) -> Optional[Usuario]:
        statement = select(Usuario).where(Usuario.username == username)
        return self.session.exec(statement).first()

    def get_by_email(self, email: str) -> Optional[Usuario]:        
        statement = select(Usuario).where(Usuario.email == email)
        return self.session.exec(statement).first()

    def list_all_admin(self) -> List[Usuario]:
        statement = select(Usuario)
        return list(self.session.exec(statement).all())
from typing import Optional, List
from app.core.base_repository import BaseRepository
from datetime import datetime, timezone
from sqlmodel import Session, select
from app.modules.categorias.models import Categoria

class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Optional[Categoria]:
        statement = select(Categoria).where(Categoria.nombre == nombre)
        return self.session.exec(statement).first()

    def list_activas(self) -> List[Categoria]:
        statement = select(Categoria).where(Categoria.activo == True)
        return list(self.session.exec(statement).all())
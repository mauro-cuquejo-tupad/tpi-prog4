from datetime import datetime, timezone
from sqlmodel import Session, select
from app.categoria.model import Categoria

def get_by_id(id: int, session: Session) -> Categoria | None:
    statement = select(Categoria).where(Categoria.id == id, Categoria.deleted_at.is_(None))
    return session.exec(statement).first()

def get_all(skip: int, limit: int, session: Session) -> list[Categoria]:
    statement = select(Categoria).where(Categoria.deleted_at.is_(None)).offset(skip).limit(limit)
    return list(session.exec(statement).all())

def get_by_nombre(nombre: str, session: Session) -> Categoria | None:
    statement = select(Categoria).where(Categoria.nombre == nombre, Categoria.deleted_at.is_(None))
    return session.exec(statement).first()

def save_categoria(categoria: Categoria, session: Session) -> Categoria:
    categoria.updated_at = datetime.now(timezone.utc)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria

def soft_delete_categoria(categoria: Categoria, session: Session) -> None:
    categoria.deleted_at = datetime.now(timezone.utc)
    session.add(categoria)
    session.commit()

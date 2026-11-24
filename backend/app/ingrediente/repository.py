from sqlmodel import Session, select
from typing import List, Optional
from app.ingrediente.model import Ingrediente

def get_by_id(id: int, session: Session) -> Optional[Ingrediente]:
    return session.get(Ingrediente, id)

def get_all(skip: int = 0, limit: int = 100, session: Session = None) -> List[Ingrediente]:
    statement = select(Ingrediente).offset(skip).limit(limit)
    return list(session.exec(statement).all())

def get_by_nombre(nombre: str, session: Session) -> Optional[Ingrediente]:
    statement = select(Ingrediente).where(Ingrediente.nombre.ilike(nombre.strip()))
    return session.exec(statement).first()

def save_ingrediente(ingrediente: Ingrediente, session: Session) -> Ingrediente:
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente

def delete_ingrediente(ingrediente: Ingrediente, session: Session) -> None:
    session.delete(ingrediente)
    session.commit()

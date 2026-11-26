from typing import TypeVar, Generic, Type, Optional, List, Sequence
from sqlmodel import SQLModel, Session, select

T = TypeVar("T", bound=SQLModel)

class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model_cls: Type[T]):
        self.session = session
        self.model_cls = model_cls

    def get_by_id(self, id: int) -> Optional[T]:
        return self.session.get(self.model_cls, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[T]:
        statement = select(self.model_cls).offset(skip).limit(limit)
        return self.session.exec(statement).all()

    def add(self, entity: T) -> T:
        self.session.add(entity)
        self.session.flush() # Para asignar ID sin hacer commit.
        return entity

    def delete(self, entity: T) -> None:
        self.session.delete(entity)
        self.session.flush()

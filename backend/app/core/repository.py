from typing import TypeVar, Generic, Type, Optional, List
from sqlmodel import SQLModel, Session, select

T = TypeVar("T", bound=SQLModel)

class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: Type[T]):
        self.session = session
        self.model = model

    def get_by_id(self, id: int) -> Optional[T]:
        return self.session.get(self.model, id)

    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        statement = select(self.model).offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def create(self, entity: T) -> T:
        self.session.add(entity)
        self.session.flush()
        return entity

    def update(self, entity: T) -> T:
        self.session.add(entity)
        self.session.flush()
        return entity

    def delete(self, entity: T) -> None:
        self.session.delete(entity)
        self.session.flush()

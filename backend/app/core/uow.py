from app.core.database import session_factory, engine
from sqlmodel import Session
from app.modules.usuarios.repository import UsuarioRepository

class UnitOfWork:
    def __init__(self, factory=session_factory):
        self.session_factory = factory
        self.session: Session | None = None
        self.usuarios: UsuarioRepository | None = None

    def __enter__(self):
        self.session = self.session_factory()
        self.usuarios = UsuarioRepository(self.session)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is not None:
                self.rollback()
            else:
                self.commit()
        finally:
            if self.session:
                self.session.close()

    def commit(self):
        if self.session:
            self.session.commit()

    def rollback(self):
        if self.session:
            self.session.rollback()

def get_uow():
    return UnitOfWork()

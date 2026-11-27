from app.modules.usuarios.repository import UsuarioRepository
from app.core.unit_of_work import UnitOfWork

class UsuarioUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.usuarios = UsuarioRepository(self.session)
        return self

def get_usuario_uow() -> UsuarioUnitOfWork:
    return UsuarioUnitOfWork()
from app.modules.categorias.repository import CategoriaRepository
from app.core.unit_of_work import UnitOfWork

class CategoriaUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.categorias = CategoriaRepository(self.session)
        return self

def get_categoria_uow() -> CategoriaUnitOfWork:
    return CategoriaUnitOfWork()
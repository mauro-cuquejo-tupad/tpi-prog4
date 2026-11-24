from app.core.database import session_factory
from app.core.unit_of_work import AbstractUnitOfWork
from app.pedidos.repository import PedidoRepository, DetallePedidoRepository, CatalogosRepository
from app.producto.repository import get_by_id as get_producto_by_id

class PedidoUnitOfWork(AbstractUnitOfWork):
    def __init__(self, factory=session_factory):
        super().__init__(factory)
        self.pedidos: PedidoRepository | None = None
        self.detalles: DetallePedidoRepository | None = None
        self.catalogos: CatalogosRepository | None = None

    def __enter__(self):
        super().__enter__()
        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.catalogos = CatalogosRepository(self.session)
        return self

    def obtener_producto(self, producto_id: int):
        return get_producto_by_id(producto_id, self.session)

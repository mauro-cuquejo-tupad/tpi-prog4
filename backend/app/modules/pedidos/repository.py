from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Session, select
from app.pedidos.models import Pedido, DetallePedido, FormaPago, EstadoPedido, DireccionEntrega
from app.core.repository import BaseRepository

class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def get_by_id(self, id: int) -> Optional[Pedido]:
        statement = select(Pedido).where(Pedido.id == id, Pedido.deleted_at.is_(None))
        return self.session.exec(statement).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Pedido]:
        statement = select(Pedido).where(Pedido.deleted_at.is_(None)).offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def save(self, pedido: Pedido) -> Pedido:
        self.session.add(pedido)
        self.session.flush()
        return pedido

    def soft_delete(self, pedido: Pedido) -> None:
        pedido.deleted_at = datetime.now(timezone.utc)
        self.session.add(pedido)

class DetallePedidoRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, detalle: DetallePedido) -> None:
        self.session.add(detalle)

class CatalogosRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_formas_pago(self) -> List[FormaPago]:
        return list(self.session.exec(select(FormaPago)).all())

    def list_estados_pedido(self) -> List[EstadoPedido]:
        return list(self.session.exec(select(EstadoPedido)).all())

    def add_direccion(self, direccion: DireccionEntrega) -> DireccionEntrega:
        self.session.add(direccion)
        return direccion

    def list_direcciones_usuario(self, usuario_id: int) -> List[DireccionEntrega]:
        statement = select(DireccionEntrega).where(
            DireccionEntrega.usuario_id == usuario_id,
            DireccionEntrega.deleted_at.is_(None)
        )
        return list(self.session.exec(statement).all())

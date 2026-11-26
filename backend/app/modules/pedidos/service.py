from typing import List, Optional
from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.pedidos.models import Pedido, DetallePedido, DireccionEntrega
from app.pedidos.schemas import PedidoCreate, PedidoRead, PedidoReadFull, PedidoUpdateEstado, DireccionEntregaCreate, DireccionEntregaRead, CatalogoItemRead
from app.pedidos.unit_of_work import PedidoUnitOfWork

class PedidoNoEncontrado(Exception):
    pass

class ProductoNoEncontrado(Exception):
    pass

class PedidoEstadoInvalido(Exception):
    pass

class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def listar(self, skip: int = 0, limit: int = 100) -> List[PedidoRead]:
        with self.uow:
            pedidos = self.uow.pedidos.get_all(skip=skip, limit=limit)
            return [PedidoRead.model_validate(p) for p in pedidos]

    def obtener_por_id(self, id: int) -> PedidoReadFull:
        with self.uow:
            pedido = self.uow.pedidos.get_by_id(id)
            if not pedido:
                raise PedidoNoEncontrado()
            return PedidoReadFull.model_validate(pedido)

    def crear(self, data: PedidoCreate, usuario_id: int) -> PedidoReadFull:
        with self.uow:
            producto_ids = [d.producto_id for d in data.detalles]
            if len(producto_ids) != len(set(producto_ids)):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="No se permiten productos duplicados en el pedido"
                )

            total = 0.0
            detalles_a_crear = []

            for item in data.detalles:
                producto = self.uow.obtener_producto(item.producto_id)
                if not producto:
                    raise ProductoNoEncontrado(f"Producto con id {item.producto_id} no encontrado")

                subtotal = producto.precio_base * item.cantidad
                total += subtotal

                detalles_a_crear.append({
                    "producto_id": item.producto_id,
                    "cantidad": item.cantidad,
                    "precio_unitario": producto.precio_base,
                })

            now = datetime.now(timezone.utc)
            pedido = Pedido(
                usuario_id=usuario_id,
                direccion_entrega_id=data.direccion_entrega_id,
                forma_pago_id=data.forma_pago_id,
                total=total,
                estado="PENDIENTE",
                fecha=now,
                created_at=now,
                updated_at=now,
                deleted_at=None,
            )
            self.uow.pedidos.save(pedido)

            for d in detalles_a_crear:
                detalle = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=d["producto_id"],
                    cantidad=d["cantidad"],
                    precio_unitario=d["precio_unitario"],
                )
                self.uow.detalles.add(detalle)

            self.uow.commit()
            return PedidoReadFull.model_validate(pedido)

    def actualizar_estado(self, id: int, data: PedidoUpdateEstado) -> PedidoReadFull:
        with self.uow:
            pedido = self.uow.pedidos.get_by_id(id)
            if not pedido:
                raise PedidoNoEncontrado()

            pedido.estado = data.estado
            pedido.updated_at = datetime.now(timezone.utc)
            self.uow.pedidos.save(pedido)
            self.uow.commit()
            return PedidoReadFull.model_validate(pedido)

    def eliminar(self, id: int) -> None:
        with self.uow:
            pedido = self.uow.pedidos.get_by_id(id)
            if not pedido:
                raise PedidoNoEncontrado()

            self.uow.pedidos.soft_delete(pedido)
            self.uow.commit()

    def crear_direccion(self, data: DireccionEntregaCreate, usuario_id: int) -> DireccionEntregaRead:
        with self.uow:
            dir_ent = DireccionEntrega(
                usuario_id=usuario_id,
                calle=data.calle,
                numero=data.numero,
                piso_depto=data.piso_depto,
                ciudad=data.ciudad,
                codigo_postal=data.codigo_postal,
            )
            self.uow.catalogos.add_direccion(dir_ent)
            self.uow.commit()
            return DireccionEntregaRead.model_validate(dir_ent)

    def listar_direcciones(self, usuario_id: int) -> List[DireccionEntregaRead]:
        with self.uow:
            dirs = self.uow.catalogos.list_direcciones_usuario(usuario_id)
            return [DireccionEntregaRead.model_validate(d) for d in dirs]

    def listar_formas_pago(self) -> List[CatalogoItemRead]:
        with self.uow:
            fps = self.uow.catalogos.list_formas_pago()
            return [CatalogoItemRead.model_validate(f) for f in fps]

    def listar_estados_pedido(self) -> List[CatalogoItemRead]:
        with self.uow:
            eps = self.uow.catalogos.list_estados_pedido()
            return [CatalogoItemRead.model_validate(e) for e in eps]

from datetime import datetime, timezone
from sqlmodel import Session, select
from app.producto.model import Producto, ProductoCategoria
from app.categoria.model import Categoria

def get_by_id(id: int, session: Session) -> Producto | None:
    statement = select(Producto).where(Producto.id == id, Producto.deleted_at.is_(None))
    return session.exec(statement).first()

def get_all(skip: int, limit: int, session: Session) -> list[Producto]:
    statement = select(Producto).where(Producto.deleted_at.is_(None)).offset(skip).limit(limit)
    return list(session.exec(statement).all())

def get_by_nombre(nombre: str, session: Session) -> Producto | None:
    statement = select(Producto).where(Producto.nombre == nombre, Producto.deleted_at.is_(None))
    return session.exec(statement).first()

def save_producto(producto: Producto, session: Session) -> Producto:
    producto.updated_at = datetime.now(timezone.utc)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto

def soft_delete_producto(producto: Producto, session: Session) -> None:
    producto.deleted_at = datetime.now(timezone.utc)
    session.add(producto)
    session.commit()

def add_categoria_to_producto(producto: Producto, categoria: Categoria, es_principal: bool, session: Session) -> ProductoCategoria:
    enlace = session.get(ProductoCategoria, (producto.id, categoria.id))
    if enlace:
        enlace.es_principal = es_principal
    else:
        enlace = ProductoCategoria(producto_id=producto.id, categoria_id=categoria.id, es_principal=es_principal)
        session.add(enlace)
    session.commit()
    session.refresh(producto)
    return enlace
    
def remove_categoria_from_producto(producto: Producto, categoria: Categoria, session: Session) -> None:
    enlace = session.get(ProductoCategoria, (producto.id, categoria.id))
    if enlace:
        session.delete(enlace)
        session.commit()
        session.refresh(producto)

def get_enlace_categoria(producto_id: int, categoria_id: int, session: Session) -> ProductoCategoria | None:
    return session.get(ProductoCategoria, (producto_id, categoria_id))

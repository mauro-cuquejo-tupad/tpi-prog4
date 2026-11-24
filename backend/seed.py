import os
from datetime import datetime, timezone
from sqlmodel import Session, select
from app.core.database import engine, create_db_and_tables
from app.categoria.model import Categoria
from app.producto.model import Producto, ProductoCategoria
from app.ingrediente.model import Ingrediente
from app.modules.usuarios.model import Usuario, Rol, UsuarioRol
from app.pedidos.models import FormaPago, EstadoPedido
from app.core.security import hash_password

def seed_data():
    with Session(engine) as session:
        # 1. Catálogo Rol (admin, user)
        roles = {
            "admin": "Administrador del sistema con acceso completo",
            "user": "Usuario estándar del Food Store"
        }
        for nombre_rol, desc in roles.items():
            if not session.exec(select(Rol).where(Rol.nombre == nombre_rol)).first():
                session.add(Rol(nombre=nombre_rol, descripcion=desc))
        session.commit()

        # 2. Catálogos de Pedidos (Formas de Pago y Estados de Pedido)
        formas_pago = [
            ("EFECTIVO", "Pago en efectivo al recibir"),
            ("TARJETA_DEBITO", "Tarjeta de débito"),
            ("TARJETA_CREDITO", "Tarjeta de crédito"),
            ("MERCADO_PAGO", "Transferencia o dinero en cuenta"),
        ]
        for nombre, desc in formas_pago:
            if not session.exec(select(FormaPago).where(FormaPago.nombre == nombre)).first():
                session.add(FormaPago(nombre=nombre, descripcion=desc))

        estados = [
            ("PENDIENTE", "Pedido recibido pendiente de confirmación"),
            ("CONFIRMADO", "Pedido aceptado por la cocina"),
            ("EN_PREPARACION", "Pedido en elaboración"),
            ("ENVIADO", "Pedido en camino al domicilio"),
            ("ENTREGADO", "Pedido entregado con éxito"),
            ("CANCELADO", "Pedido cancelado"),
        ]
        for nombre, desc in estados:
            if not session.exec(select(EstadoPedido).where(EstadoPedido.nombre == nombre)).first():
                session.add(EstadoPedido(nombre=nombre, descripcion=desc))
        session.commit()

        # 3. Usuarios iniciales (admin y user estándar)
        rol_admin = session.exec(select(Rol).where(Rol.nombre == "admin")).first()
        rol_user = session.exec(select(Rol).where(Rol.nombre == "user")).first()

        admin_user = session.exec(select(Usuario).where(Usuario.email == "admin@foodstore.com")).first()
        if not admin_user:
            admin_user = Usuario(
                nombre="Administrador",
                apellido="FoodStore",
                email="admin@foodstore.com",
                celular="+5491100001111",
                password_hash=hash_password("Admin1234!"),
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
                deleted_at=None,
            )
            session.add(admin_user)
            session.commit()
            session.refresh(admin_user)
            session.add(UsuarioRol(usuario_id=admin_user.id, rol_id=rol_admin.id))
            session.commit()
            print("🌱 [SEED] Usuario admin creado (admin@foodstore.com / Admin1234!).")

        user_regular = session.exec(select(Usuario).where(Usuario.email == "juan@foodstore.com")).first()
        if not user_regular:
            user_regular = Usuario(
                nombre="Juan",
                apellido="Pérez",
                email="juan@foodstore.com",
                celular="+5491122223333",
                password_hash=hash_password("Juan1234!"),
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
                deleted_at=None,
            )
            session.add(user_regular)
            session.commit()
            session.refresh(user_regular)
            session.add(UsuarioRol(usuario_id=user_regular.id, rol_id=rol_user.id))
            session.commit()
            print("🌱 [SEED] Usuario regular creado (juan@foodstore.com / Juan1234!).")

        # 4. Categorías
        if not session.exec(select(Categoria)).first():
            cat1 = Categoria(nombre="Entradas y Tapeos", descripcion="Picadas, papas y appetizers")
            cat2 = Categoria(nombre="Sandwiches & Burgers", descripcion="Variedades artesanales al pan")
            cat3 = Categoria(nombre="Bebidas y Tragos", descripcion="Gaseosas, cervezas y coctelería")
            session.add_all([cat1, cat2, cat3])
            session.commit()
            print("🌱 [SEED] Categorías de prueba creadas.")

        # 5. Ingredientes
        if not session.exec(select(Ingrediente)).first():
            ing1 = Ingrediente(nombre="Queso Cheddar Fundido")
            ing2 = Ingrediente(nombre="Panceta Ahumada Crispy")
            ing3 = Ingrediente(nombre="Cebolla Caramelizada")
            ing4 = Ingrediente(nombre="Salsa BBQ Casera")
            session.add_all([ing1, ing2, ing3, ing4])
            session.commit()
            print("🌱 [SEED] Ingredientes de prueba creados.")

        # 6. Productos y asociación de categorías
        if not session.exec(select(Producto)).first():
            prod1 = Producto(
                nombre="Papas Rústicas Cheddar y Bacon",
                descripcion="Papas naturales cortadas a mano con salsa cheddar y lluvia de bacon crocante",
                precio_base=6800.0,
                disponible=True,
                imagenes_url=["https://images.unsplash.com/photo-1573080496219-bb080dd4f877"]
            )
            prod2 = Producto(
                nombre="Burger Monumental Triple",
                descripcion="Triple medallón vacuno de 120g, triple cheddar y cebolla caramelizada",
                precio_base=10500.0,
                disponible=True,
                imagenes_url=["https://images.unsplash.com/photo-1568901346375-23c9450c58cd"]
            )
            session.add_all([prod1, prod2])
            session.commit()
            session.refresh(prod1)
            session.refresh(prod2)

            cat_entradas = session.exec(select(Categoria).where(Categoria.nombre == "Entradas y Tapeos")).first()
            cat_burgers = session.exec(select(Categoria).where(Categoria.nombre == "Sandwiches & Burgers")).first()
            if cat_entradas:
                session.add(ProductoCategoria(producto_id=prod1.id, categoria_id=cat_entradas.id, es_principal=True))
            if cat_burgers:
                session.add(ProductoCategoria(producto_id=prod2.id, categoria_id=cat_burgers.id, es_principal=True))
            session.commit()
            print("🌱 [SEED] Productos de prueba creados.")

if __name__ == "__main__":
    create_db_and_tables()
    seed_data()
    print("Seed completado exitosamente.")

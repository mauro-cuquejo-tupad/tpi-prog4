import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.pool import StaticPool

from app.main import app
from app.modules.usuarios.model import Usuario, Rol, UsuarioRol
from app.categoria.model import Categoria
from app.producto.model import Producto, ProductoCategoria
from app.core.security import hash_password

@pytest.fixture(name="client")
def client_fixture(monkeypatch):
    engine_test = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )

    def session_test_factory():
        return Session(engine_test, expire_on_commit=False)

    monkeypatch.setattr("app.core.database.engine", engine_test)
    monkeypatch.setattr("app.core.database.session_factory", session_test_factory)
    monkeypatch.setattr("app.core.uow.session_factory", session_test_factory)
    monkeypatch.setattr("app.pedidos.router.session_factory", session_test_factory)
    
    from app.core import database
    def override_get_session():
        with Session(engine_test) as s:
            yield s
    app.dependency_overrides[database.get_session] = override_get_session

    # Deshabilitar seed de startup durante tests
    monkeypatch.setattr("app.core.config.settings.SEED_ON_STARTUP", False)

    SQLModel.metadata.create_all(engine_test)

    # Cargar roles
    with Session(engine_test) as session:
        r_admin = Rol(nombre="admin", descripcion="Administrador")
        r_user = Rol(nombre="user", descripcion="Usuario común")
        session.add_all([r_admin, r_user])
        session.commit()

        # Admin
        u_admin = Usuario(
            nombre="Admin",
            apellido="Root",
            email="admin@test.com",
            password_hash=hash_password("Admin1234!"),
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        session.add(u_admin)
        session.commit()
        session.refresh(u_admin)
        session.add(UsuarioRol(usuario_id=u_admin.id, rol_id=r_admin.id))

        # User
        u_user = Usuario(
            nombre="Juan",
            apellido="Perez",
            email="juan@test.com",
            password_hash=hash_password("Juan1234!"),
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        session.add(u_user)
        session.commit()
        session.refresh(u_user)
        session.add(UsuarioRol(usuario_id=u_user.id, rol_id=r_user.id))

        # Categoría y Producto de prueba
        cat = Categoria(nombre="Entradas", descripcion="Tapeos")
        session.add(cat)
        session.commit()
        session.refresh(cat)

        prod = Producto(nombre="Empanadas", descripcion="Criollas", precio_base=1200.0, disponible=True)
        session.add(prod)
        session.commit()
        session.refresh(prod)

        session.add(ProductoCategoria(producto_id=prod.id, categoria_id=cat.id, es_principal=True))
        session.commit()

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    SQLModel.metadata.drop_all(engine_test)

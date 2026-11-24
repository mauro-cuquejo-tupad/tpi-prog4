from sqlmodel import create_engine, SQLModel, Session
from app.core.config import settings

DATABASE_URL = settings.db_url

engine = create_engine(
    DATABASE_URL,
    echo=True,  # SQL visible en consola
)

def create_db_and_tables():
    if settings.RESET_DB_ON_STARTUP:
        print("⚠️ [RESET_DB_ON_STARTUP] Reiniciando tablas de la base de datos (drop_all)...")
        SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

def session_factory() -> Session:
    return Session(engine, expire_on_commit=False)

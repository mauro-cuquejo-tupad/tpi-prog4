from sqlmodel import create_engine, SQLModel, Session
from app.core.config import settings

connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    echo=True,  # SQL visible en consola
    connect_args=connect_args
)

def create_db_and_tables():
    if settings.RESET_DB_ON_STARTUP:        
        SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

def session_factory() -> Session:
    return Session(engine, expire_on_commit=False)

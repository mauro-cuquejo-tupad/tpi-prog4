from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):    
    
    DATABASE_URL: str = Field(
        default="sqlite:///./foodstore.db",
        description="URL de conexión a la base de datos (PostgreSQL o SQLite)"
    )
    
    SECRET_KEY: str = Field(
        default="cambiar-esta-clave-de-al-menos-32-caracteres",
        min_length=32
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    
    RESET_DB_ON_STARTUP: bool = False
    SEED_ON_STARTUP: bool = False
    
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
settings = Settings()
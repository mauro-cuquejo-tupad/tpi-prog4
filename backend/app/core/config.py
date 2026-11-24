import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    postgres_user: str = "postgres"
    postgres_password: str = "mipasswordseguro"
    postgres_db: str = "gestor_productos"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    DATABASE_URL: str | None = None

    @property
    def db_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+psycopg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    SECRET_KEY: str = Field(default="clave_secreta_super_segura_de_al_menos_32_caracteres_longitud_minima", min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    RESET_DB_ON_STARTUP: bool = False
    SEED_ON_STARTUP: bool = True

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }

settings = Settings()

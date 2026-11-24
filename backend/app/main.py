import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import create_db_and_tables
from app.core.config import settings
from seed import seed_data

import app.producto.model  # Registra las tablas en SQLModel.metadata
import app.categoria.model
import app.ingrediente.model
import app.pedidos.models
import app.modules.usuarios.model

from app.modules.usuarios.router import router as auth_router
from app.producto.router import router as producto_router
from app.categoria.router import router as categoria_router
from app.ingrediente.router import router as ingrediente_router
from app.pedidos.router import router as pedidos_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()

    if settings.SEED_ON_STARTUP:
        seed_data()

    yield

def create_app() -> FastAPI:
    app = FastAPI(
        title="Gestor de Productos, Categorías, Ingredientes, Pedidos y Seguridad",
        version="2.0.0",
        lifespan=lifespan
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Router de autenticación bajo /api/v1/auth
    app.include_router(auth_router, prefix="/api/v1")

    # Módulos del Food Store
    app.include_router(categoria_router)
    app.include_router(producto_router)
    app.include_router(ingrediente_router)
    app.include_router(pedidos_router)

    return app

app = create_app()

# Gestor Gastronómico - Trabajo Práctico 10
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

---

## 📌 Descripción del Proyecto

Aplicación web integral para la administración de un catálogo gastronómico (categorías, productos e ingredientes), gestión de usuarios y pedidos.

En esta etapa del proyecto, el frontend fue refactorizado adoptando una **arquitectura modular por features**, organizando el código en torno a los dominios del sistema en lugar de agrupar los archivos por tipo técnico. Además, se implementó el control de acceso en el cliente con **rutas protegidas por rol**, consumo seguro de la sesión mediante cookies `HttpOnly` y manejo de estado global de interfaz (tema visual y notificaciones).

---

## 📁 Estructura del Repositorio

El repositorio se compone de dos aplicaciones principales:

```text
tp-10/
├── fastapi-productos/     # Backend en Python (FastAPI + SQLModel + PostgreSQL)
├── tp-categorias/         # Frontend en React + TypeScript + Vite + Tailwind CSS
├── docker-compose.yml     # Servicio de base de datos PostgreSQL
└── Readme.md              # Documentación general
```

### 🔹 Frontend (`tp-categorias`)
Se adoptó una **arquitectura por features** para separar responsabilidades por dominio en lugar de agrupar archivos por tipo técnico:
- **`features/`**: cada módulo (`auth`, `categories`, `products`, `ingredients`) reúne sus propios componentes, páginas, tipos, servicios y hooks. Cada una expone su funcionalidad pública mediante un barrel (`index.ts`), evitando que una feature importe subcarpetas internas de otra.
- **`shared/`**: aloja elementos transversales reutilizados por varias features (instancia e interceptores de Axios, Navbar, Toast y componentes de estado).
- **`routes/`**: define las rutas en `AppRouter.tsx` y el guardián `ProtectedRoute.tsx` con `<Outlet />`, validando sesión y roles antes de renderizar cada vista.
- **`store/`**: stores de Zustand para estado transversal de interfaz (tema claro/oscuro persistido y notificaciones).
- **Alias `@/`**: configurado para imports directos y limpios sin rutas relativas largas.

### 🔹 Backend (`fastapi-productos`)
Servidor API REST que provee:
- Autenticación y control de sesión con tokens JWT en cookies seguras `HttpOnly`.
- Control de acceso basado en roles (usuarios estándar y administradores).
- Endpoints para la gestión completa del catálogo de productos, categorías, ingredientes y pedidos.

---

## 🚀 Puesta en Marcha

### 1. Base de Datos
Para iniciar la base de datos PostgreSQL con Docker:
```bash
docker compose up -d
```

### 2. Backend (FastAPI)
1. Ingresar a la carpeta del backend:
   ```bash
   cd fastapi-productos
   ```
2. Instalar los paquetes necesarios:
   ```bash
   pip install -r requirements.txt
   ```
3. Ejecutar el servidor:
   ```bash
   uvicorn app.main:app --reload
   ```
> La documentación interactiva queda disponible en: `http://localhost:8000/docs`

### 3. Frontend (React)
1. Ingresar a la carpeta del frontend:
   ```bash
   cd tp-categorias
   ```
2. Instalar dependencias:
   ```bash
   pnpm install
   ```
3. Iniciar el entorno de desarrollo:
   ```bash
   pnpm dev
   ```
4. Para compilar la versión de producción:
   ```bash
   pnpm build
   ```

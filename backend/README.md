# Backend - Gestor Gastronómico
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

API REST desarrollada con **FastAPI** y **SQLModel** para la gestión del catálogo gastronómico, administración de usuarios y procesamiento de pedidos.

---

## ⚙️ Características

- **Autenticación y Seguridad:** inicio de sesión y registro de usuarios, emitiendo tokens JWT gestionados mediante cookies seguras `HttpOnly`.
- **Control de Acceso (RBAC):** permisos diferenciados para usuarios estándar y administradores sobre las operaciones de lectura y modificación del catálogo.
- **Catálogo Completo:** endpoints para la gestión de productos, categorías e ingredientes con soporte de borrado lógico.
- **Gestión de Pedidos:** registro de pedidos y direcciones asociadas a la sesión activa del usuario.

---

## 🚀 Instalación y Uso

1. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurar el entorno:**
   Crear un archivo `.env` basado en `.env.example`:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/gestor_productos
   SECRET_KEY=clave_secreta_para_firmar_los_tokens
   RESET_DB_ON_STARTUP=false
   SEED_ON_STARTUP=true
   ```

3. **Ejecutar la API:**
   ```bash
   uvicorn app.main:app --reload
   ```

Documentación interactiva disponible en: `http://localhost:8000/docs`.

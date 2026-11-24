# Frontend - Gestor Gastronómico
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

Frontend desarrollado en **React** y **TypeScript** con **Vite**, estilizado con **Tailwind CSS** y estructurado mediante una **arquitectura por features**.

---

## 🛠️ Arquitectura por Features Adoptada

Para este trabajo práctico se abandonó la clásica estructura plana donde todos los componentes, hooks o páginas iban juntos en carpetas genéricas. En su lugar, el proyecto se organizó por **módulos de dominio o features**, donde cada parte del sistema es autónoma:

- **Estructura interna de cada feature:** dentro de cada carpeta en `src/features/` (`auth`, `categories`, `products` e `ingredients`) se agrupan exclusivamente los recursos que le pertenecen:
  - `components/`: elementos visuales propios de esa funcionalidad (tarjetas, listas, formularios modales).
  - `hooks/`: hooks personalizados que manejan la lógica y las llamadas asíncronas con TanStack Query.
  - `pages/`: las vistas o pantallas principales que renderiza el router.
  - `services/`: funciones que hacen las peticiones HTTP a la API.
  - `types/`: interfaces y tipos de TypeScript del dominio.
  - `index.ts`: archivo barrel que exporta únicamente la API pública de la feature. Si otro módulo necesita algo de acá, lo importa directamente desde este archivo y nunca desde sus carpetas internas.

- **Código compartido (`src/shared/`):** acá se colocó todo lo que no pertenece a una feature en particular y se usa en varios lados, como la configuración de Axios, los interceptores de sesión, la barra de navegación (`Navbar`), el `Toast` y los modales genéricos.

- **Rutas (`src/routes/`):** concentra la navegación en `AppRouter.tsx` y el guardián de acceso `ProtectedRoute.tsx`, separando las pantallas públicas de las privadas mediante `<Outlet />`.

- **Estado global (`src/store/`):** stores ligeros de Zustand para el tema claro/oscuro (con persistencia en `localStorage`) y las notificaciones temporales.

---

## 💻 Comandos del Proyecto

```bash
# Instalar dependencias
pnpm install

# Iniciar en modo desarrollo
pnpm dev

# Compilar para producción y verificar tipado
pnpm build

# Ejecutar el linter
pnpm lint
```

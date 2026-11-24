import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/categories" && (location.pathname === "/" || location.pathname === "/categories" || location.pathname === "/categorias")) {
      return true;
    }
    return location.pathname === path;
  };

  const isAdmin = hasRole("admin");

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to={user ? "/categories" : "/login"} className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Gestor Gastronómico
              </span>
            </Link>

            {user && (
              <div className="hidden sm:flex space-x-2">
                <Link
                  to="/categories"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/categories")
                      ? "bg-slate-800 text-blue-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  Categorías
                </Link>
                <Link
                  to="/products"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/products")
                      ? "bg-slate-800 text-blue-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  Productos
                </Link>
                <Link
                  to="/ingredientes"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/ingredientes")
                      ? "bg-slate-800 text-blue-400"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  Ingredientes
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/admin/users")
                        ? "bg-slate-800 text-purple-400"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                  >
                    Usuarios (Admin)
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 select-none hidden sm:inline">
                ☀️
              </span>
              <ThemeToggle />
              <span className="text-xs text-slate-400 select-none hidden sm:inline">
                🌙
              </span>
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-200">
                    {user.nombre} {user.apellido}
                  </div>
                  <div className="text-xs text-slate-400">
                    Rol: <span className="text-blue-400 font-semibold">{user.roles?.join(", ") || user.role}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white px-3 py-1.5 text-xs font-semibold border border-slate-700 hover:border-rose-700 transition-colors cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

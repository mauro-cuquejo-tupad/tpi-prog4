import React from "react";
import { Link } from "react-router-dom";

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl border border-slate-200 dark:border-gray-700 max-w-md w-full">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40 mb-4">
          <span className="text-3xl text-rose-600 dark:text-rose-400 font-bold">403</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Acceso Denegado
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          No contás con los permisos necesarios para acceder a esta sección.
        </p>
        <div className="mt-6">
          <Link
            to="/categories"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

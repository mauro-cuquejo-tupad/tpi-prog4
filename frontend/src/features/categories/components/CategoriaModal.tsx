import React from "react";
import { useForm } from "@tanstack/react-form";
import type { Categoria, CategoriaFormData } from "../types/categoria.types";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoriaFormData) => void;
  categoriaSeleccionada: Categoria | null;
  isLoading?: boolean;
  apiError?: string | null;
}

export const CategoriaModal: React.FC<CategoriaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categoriaSeleccionada,
  isLoading = false,
  apiError = null,
}) => {
  useEscapeKey(onClose, isOpen && !isLoading);

  const form = useForm({
    defaultValues: {
      nombre: categoriaSeleccionada?.nombre ?? "",
      descripcion: categoriaSeleccionada?.descripcion ?? "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
      });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-slate-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          {categoriaSeleccionada ? "Editar Categoría" : "Nueva Categoría"}
        </h2>

        {apiError && (
          <div className="mb-4 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-3 text-sm text-rose-800 dark:text-rose-300">
            {apiError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) =>
                !value || !value.trim()
                  ? "El nombre es obligatorio y no puede estar vacío"
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label htmlFor="cat-nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Nombre de la categoría *
                </label>
                <input
                  id="cat-nombre"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej. Pizzas, Hamburguesas..."
                  className="w-full rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                {field.state.meta.errors ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <div>
                <label htmlFor="cat-desc" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  id="cat-desc"
                  name={field.name}
                  rows={3}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Descripción breve..."
                  className="w-full rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </form.Field>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isLoading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isLoading || isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaModal;

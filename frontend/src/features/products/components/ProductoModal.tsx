import React from "react";
import { useForm } from "@tanstack/react-form";
import type { Producto, ProductoFormData } from "../types/producto.types";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";

interface ProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductoFormData) => void;
  productoSeleccionado: Producto | null;
  isLoading?: boolean;
  apiError?: string | null;
}

export const ProductoModal: React.FC<ProductoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productoSeleccionado,
  isLoading = false,
  apiError = null,
}) => {
  useEscapeKey(onClose, isOpen && !isLoading);

  const form = useForm({
    defaultValues: {
      nombre: productoSeleccionado?.nombre ?? "",
      descripcion: productoSeleccionado?.descripcion ?? "",
      precio_base: productoSeleccionado?.precio_base ? String(productoSeleccionado.precio_base) : "",
      disponible: productoSeleccionado?.disponible ?? true,
      imagenes_url: productoSeleccionado?.imagenes_url?.join(", ") ?? "",
    },
    onSubmit: async ({ value }) => {
      const urls = value.imagenes_url
        ? value.imagenes_url.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        precio_base: parseFloat(value.precio_base),
        disponible: value.disponible,
        imagenes_url: urls,
      });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-slate-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          {productoSeleccionado ? "Editar Producto" : "Nuevo Producto"}
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
                  ? "El nombre del producto es obligatorio"
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label htmlFor="prod-nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Nombre del producto *
                </label>
                <input
                  id="prod-nombre"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ej. Pizza Margarita"
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

          <form.Field
            name="precio_base"
            validators={{
              onChange: ({ value }) => {
                if (!value || isNaN(Number(value))) {
                  return "Debe ingresar un valor numérico válido para el precio";
                }
                if (Number(value) <= 0) {
                  return "El precio base debe ser mayor a 0";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <label htmlFor="prod-precio" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Precio base ($) *
                </label>
                <input
                  id="prod-precio"
                  type="number"
                  step="0.01"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="0.00"
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
                <label htmlFor="prod-desc" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Descripción
                </label>
                <textarea
                  id="prod-desc"
                  name={field.name}
                  rows={2}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Descripción detallada de la oferta..."
                  className="w-full rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="imagenes_url">
            {(field) => (
              <div>
                <label htmlFor="prod-imgs" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  URLs de imágenes (separadas por coma)
                </label>
                <input
                  id="prod-imgs"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://ejemplo.com/foto1.jpg, https://ejemplo.com/foto2.jpg"
                  className="w-full rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="disponible">
            {(field) => (
              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="prod-disp"
                  type="checkbox"
                  name={field.name}
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="prod-disp" className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                  Producto disponible para la venta
                </label>
              </div>
            )}
          </form.Field>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-gray-700">
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

export default ProductoModal;

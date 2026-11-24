import React, { useState } from "react";
import type { Producto, ProductoFormData } from "../types/producto.types";
import { useProducts } from "../hooks/useProducts";
import { ProductoList } from "../components/ProductoList";
import { ProductoModal } from "../components/ProductoModal";
import { LoadingState, ErrorState, ConfirmModal } from "@/shared/components/SharedModalsAndStates";
import { useAuthStore } from "@/features/auth";

export const ProductsPage: React.FC = () => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole("admin");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

  const {
    productos,
    isLoading,
    isError,
    error,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    isMutating,
  } = useProducts();

  const abrirParaCrear = () => {
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirParaEditar = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  const handleModalSubmit = (data: ProductoFormData) => {
    if (productoSeleccionado) {
      updateMutation.mutate(
        { id: productoSeleccionado.id, data },
        { onSuccess: cerrarModal }
      );
    } else {
      createMutation.mutate(data, { onSuccess: cerrarModal });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 dark:border-gray-700 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Productos
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isAdmin ? "Administración de productos" : "Catálogo de productos"}
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={abrirParaCrear}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >
            + Nuevo Producto
          </button>
        )}
      </div>

      {isLoading && <LoadingState message="Cargando productos..." />}

      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <ProductoList
          productos={productos}
          isAdmin={isAdmin}
          onEdit={abrirParaEditar}
          onDelete={(id) => setIdAEliminar(id)}
        />
      )}

      {/* Modal Formulario */}
      <ProductoModal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSubmit={handleModalSubmit}
        productoSeleccionado={productoSeleccionado}
        isLoading={isMutating}
      />

      {/* Modal Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={idAEliminar !== null}
        title="Eliminar Producto"
        message="¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isDestructive={true}
        onConfirm={() => {
          if (idAEliminar !== null) {
            deleteMutation.mutate(idAEliminar, {
              onSettled: () => setIdAEliminar(null),
            });
          }
        }}
        onClose={() => setIdAEliminar(null)}
      />
    </div>
  );
};

export default ProductsPage;

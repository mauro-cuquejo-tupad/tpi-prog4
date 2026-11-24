import React, { useState } from "react";
import type { Categoria, CategoriaFormData } from "../types/categoria.types";
import { useCategories } from "../hooks/useCategories";
import { CategoriaList } from "../components/CategoriaList";
import { CategoriaModal } from "../components/CategoriaModal";
import { LoadingState, ErrorState, ConfirmModal } from "@/shared/components/SharedModalsAndStates";
import { useAuthStore } from "@/features/auth";

export const CategoriasPage: React.FC = () => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole("admin");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

  const {
    categorias,
    isLoading,
    isError,
    error,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    isMutating,
  } = useCategories();

  const abrirParaCrear = () => {
    setCategoriaSeleccionada(null);
    setModalAbierto(true);
  };

  const abrirParaEditar = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
  };

  const handleModalSubmit = (data: CategoriaFormData) => {
    if (categoriaSeleccionada) {
      updateMutation.mutate(
        { id: categoriaSeleccionada.id, data },
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
            Categorías
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isAdmin ? "Administración de categorías" : "Catálogo de categorías"}
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={abrirParaCrear}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >
            + Nueva Categoría
          </button>
        )}
      </div>

      {isLoading && <LoadingState message="Cargando categorías..." />}

      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <CategoriaList
          categorias={categorias}
          isAdmin={isAdmin}
          onEdit={abrirParaEditar}
          onDelete={(id) => setIdAEliminar(id)}
        />
      )}

      {/* Modal Formulario */}
      <CategoriaModal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSubmit={handleModalSubmit}
        categoriaSeleccionada={categoriaSeleccionada}
        isLoading={isMutating}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={idAEliminar !== null}
        title="Eliminar Categoría"
        message="¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer."
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

export default CategoriasPage;

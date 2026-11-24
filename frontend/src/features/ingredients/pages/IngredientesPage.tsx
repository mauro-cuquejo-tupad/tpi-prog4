import React, { useState } from "react";
import type { Ingrediente, IngredienteFormData } from "../types/ingrediente.types";
import { useIngredients } from "../hooks/useIngredients";
import { IngredienteList } from "../components/IngredienteList";
import { IngredienteModal } from "../components/IngredienteModal";
import { LoadingState, ErrorState, ConfirmModal } from "@/shared/components/SharedModalsAndStates";
import { useAuthStore } from "@/features/auth";

export const IngredientesPage: React.FC = () => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole("admin");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<Ingrediente | null>(null);
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null);

  const {
    ingredientes,
    isLoading,
    isError,
    error,
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    isMutating,
  } = useIngredients();

  const abrirParaCrear = () => {
    setIngredienteSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirParaEditar = (ingrediente: Ingrediente) => {
    setIngredienteSeleccionado(ingrediente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setIngredienteSeleccionado(null);
  };

  const handleModalSubmit = (data: IngredienteFormData) => {
    if (ingredienteSeleccionado) {
      updateMutation.mutate(
        { id: ingredienteSeleccionado.id, data },
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
            Ingredientes
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isAdmin ? "Administración de ingredientes" : "Catálogo de ingredientes"}
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={abrirParaCrear}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >
            + Nuevo Ingrediente
          </button>
        )}
      </div>

      {isLoading && <LoadingState message="Cargando ingredientes..." />}

      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <IngredienteList
          ingredientes={ingredientes}
          isAdmin={isAdmin}
          onEdit={abrirParaEditar}
          onDelete={(id) => setIdAEliminar(id)}
        />
      )}

      {/* Modal Formulario */}
      <IngredienteModal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSubmit={handleModalSubmit}
        ingredienteSeleccionado={ingredienteSeleccionado}
        isLoading={isMutating}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={idAEliminar !== null}
        title="Eliminar Ingrediente"
        message="¿Está seguro de que desea eliminar este ingrediente? Esta acción no se puede deshacer."
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

export default IngredientesPage;

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIngredientes,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
} from "../services/ingrediente.service";
import type { Ingrediente, IngredienteFormData } from "../types/ingrediente.types";
import { useNotificationStore } from "@/store/notificationStore";
import { handleApiError } from "@/shared/api/handleApiError";

export function useIngredients() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((s) => s.showNotification);

  const query = useQuery<Ingrediente[]>({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
  });

  const createMutation = useMutation({
    mutationFn: (data: IngredienteFormData) => createIngrediente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      showNotification("Ingrediente creado exitosamente");
    },
    onError: (err: unknown) => {
      showNotification(`Error al crear ingrediente: ${handleApiError(err)}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteFormData }) =>
      updateIngrediente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      showNotification("Ingrediente actualizado correctamente");
    },
    onError: (err: unknown) => {
      showNotification(`Error al actualizar ingrediente: ${handleApiError(err)}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteIngrediente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
      showNotification("Ingrediente eliminado correctamente");
    },
    onError: (err: unknown) => {
      showNotification(`Error al eliminar ingrediente: ${handleApiError(err)}`);
    },
  });

  return {
    ingredientes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}

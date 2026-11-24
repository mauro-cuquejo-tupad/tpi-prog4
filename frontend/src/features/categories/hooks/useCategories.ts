import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoria.service";
import type { Categoria, CategoriaFormData } from "../types/categoria.types";
import { useNotificationStore } from "@/store/notificationStore";
import { handleApiError } from "@/shared/api/handleApiError";

export function useCategories() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((s) => s.showNotification);

  const query = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: getCategorias,
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoriaFormData) => createCategoria(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      showNotification("Categoría creada exitosamente");
    },
    onError: (err: unknown) => {
      showNotification(`Error al crear categoría: ${handleApiError(err)}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaFormData }) =>
      updateCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      showNotification("Categoría actualizada correctamente");
    },
    onError: (err: unknown) => {
      showNotification(`Error al actualizar categoría: ${handleApiError(err)}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      showNotification("Categoría eliminada correctamente");
    },
    onError: (err: unknown) => {
      showNotification(`Error al eliminar categoría: ${handleApiError(err)}`);
    },
  });

  return {
    categorias: query.data ?? [],
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

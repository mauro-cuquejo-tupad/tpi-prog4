import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/producto.service";
import type { Producto, ProductoFormData } from "../types/producto.types";
import { useNotificationStore } from "@/store/notificationStore";
import { handleApiError } from "@/shared/api/handleApiError";

export function useProducts() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((s) => s.showNotification);

  const query = useQuery<Producto[]>({
    queryKey: ["productos"],
    queryFn: getProductos,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductoFormData) => createProducto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      showNotification("Producto creado exitosamente");
    },
    onError: (err: unknown) => {
      showNotification(`Error al crear producto: ${handleApiError(err)}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoFormData }) =>
      updateProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      showNotification("Producto actualizado correctamente");
    },
    onError: (err: unknown) => {
      showNotification(`Error al actualizar producto: ${handleApiError(err)}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      showNotification("Producto eliminado correctamente");
    },
    onError: (err: unknown) => {
      showNotification(`Error al eliminar producto: ${handleApiError(err)}`);
    },
  });

  return {
    productos: query.data ?? [],
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

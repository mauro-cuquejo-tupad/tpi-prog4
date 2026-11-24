import { api } from "@/shared/api/api";
import type { Producto, ProductoFormData } from "../types/producto.types";

export const getProductos = async (): Promise<Producto[]> => {
  const response = await api.get<Producto[]>("/productos/");
  return response.data;
};

export const getProductoById = async (id: number): Promise<Producto> => {
  const response = await api.get<Producto>(`/productos/${id}`);
  return response.data;
};

export const createProducto = async (data: ProductoFormData): Promise<Producto> => {
  const response = await api.post<Producto>("/productos/", data);
  return response.data;
};

export const updateProducto = async (
  id: number,
  data: ProductoFormData
): Promise<Producto> => {
  const response = await api.put<Producto>(`/productos/${id}`, data);
  return response.data;
};

export const deleteProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`);
};

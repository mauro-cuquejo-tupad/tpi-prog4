import { api } from "@/shared/api/api";
import type { Categoria, CategoriaFormData } from "../types/categoria.types";

export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await api.get<Categoria[]>("/categorias/");
  return response.data;
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const response = await api.get<Categoria>(`/categorias/${id}`);
  return response.data;
};

export const createCategoria = async (data: CategoriaFormData): Promise<Categoria> => {
  const response = await api.post<Categoria>("/categorias/", data);
  return response.data;
};

export const updateCategoria = async (
  id: number,
  data: CategoriaFormData
): Promise<Categoria> => {
  const response = await api.put<Categoria>(`/categorias/${id}`, data);
  return response.data;
};

export const deleteCategoria = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`);
};

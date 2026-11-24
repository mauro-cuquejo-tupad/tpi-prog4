import { api } from "@/shared/api/api";
import type { Ingrediente, IngredienteFormData } from "../types/ingrediente.types";

export const getIngredientes = async (): Promise<Ingrediente[]> => {
  const response = await api.get<Ingrediente[]>("/ingredientes/");
  return response.data;
};

export const getIngredienteById = async (id: number): Promise<Ingrediente> => {
  const response = await api.get<Ingrediente>(`/ingredientes/${id}`);
  return response.data;
};

export const createIngrediente = async (data: IngredienteFormData): Promise<Ingrediente> => {
  const response = await api.post<Ingrediente>("/ingredientes/", data);
  return response.data;
};

export const updateIngrediente = async (
  id: number,
  data: IngredienteFormData
): Promise<Ingrediente> => {
  const response = await api.put<Ingrediente>(`/ingredientes/${id}`, data);
  return response.data;
};

export const deleteIngrediente = async (id: number): Promise<void> => {
  await api.delete(`/ingredientes/${id}`);
};

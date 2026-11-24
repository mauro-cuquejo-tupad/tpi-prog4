import { api } from "@/shared/api/api";
import type { User, RegisterFormData, UsuarioAdmin } from "../types/auth.types";

const AUTH = "/api/v1/auth";

export const requestLogin = async (usernameOrEmail: string, password: string): Promise<void> => {
  const formData = new URLSearchParams();
  formData.append("username", usernameOrEmail);
  formData.append("password", password);
  await api.post(`${AUTH}/token`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const requestMe = async (): Promise<User> => {
  const response = await api.get<User>(`${AUTH}/me`);
  return response.data;
};

export const requestLogout = async (): Promise<void> => {
  await api.post(`${AUTH}/logout`);
};

export const requestRegister = async (data: RegisterFormData): Promise<User> => {
  const response = await api.post<User>(`${AUTH}/register`, data);
  return response.data;
};

export const getUsuarios = async (): Promise<UsuarioAdmin[]> => {
  const response = await api.get<UsuarioAdmin[]>(`${AUTH}/admin/usuarios`);
  return response.data;
};

export const activarUsuario = async (id: number): Promise<UsuarioAdmin> => {
  const response = await api.post<UsuarioAdmin>(`${AUTH}/admin/usuarios/${id}/activar`);
  return response.data;
};

export const desactivarUsuario = async (id: number): Promise<UsuarioAdmin> => {
  const response = await api.post<UsuarioAdmin>(`${AUTH}/admin/usuarios/${id}/desactivar`);
  return response.data;
};

export type Role = "user" | "admin";

export interface User {
  id: number;
  nombre?: string;
  apellido?: string;
  email: string;
  roles?: string[];
  role?: Role;
  username?: string;
  full_name?: string;
  celular?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  disabled?: boolean;
}

export type UsuarioAuth = User;

export interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  password: string;
}

export interface UsuarioAdmin {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular: string | null;
  roles: string[];
  deleted_at?: string | null;
  activo?: boolean;
}

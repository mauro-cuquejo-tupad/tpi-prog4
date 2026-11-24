import axios from "axios";

interface DetailObj {
  msg?: string;
  [key: string]: unknown;
}

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.detail) {
      if (typeof error.response.data.detail === "string") {
        return error.response.data.detail;
      }
      if (Array.isArray(error.response.data.detail)) {
        return error.response.data.detail
          .map((err: DetailObj) => err.msg || JSON.stringify(err))
          .join(", ");
      }
      return JSON.stringify(error.response.data.detail);
    }
    if (error.response?.status === 401) {
      return "Sesión expirada o credenciales incorrectas.";
    }
    if (error.response?.status === 403) {
      return "Acceso denegado: no cuenta con permisos suficientes.";
    }
    if (error.response?.status === 404) {
      return "El recurso solicitado no fue encontrado.";
    }
    if (error.response?.status === 500) {
      return "Error interno del servidor. Intente nuevamente más tarde.";
    }
    return error.message || "Error al conectar con el servidor.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado.";
};

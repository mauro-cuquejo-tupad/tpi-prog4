import { api } from "./api";
import { useAuthStore } from "@/features/auth";
import { useNotificationStore } from "@/store/notificationStore";

const RUTAS_DE_AUTH = ["/auth/token", "/auth/me"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    const esDeAuth = RUTAS_DE_AUTH.some((r) => url.includes(r));

    if (error.response?.status === 401 && !esDeAuth) {
      useAuthStore.setState({ user: null, status: "unauthenticated" });
    }

    if (error.response?.status === 403) {
      useNotificationStore.getState().showNotification("Acceso denegado: permisos insuficientes");
    }

    return Promise.reject(error);
  }
);

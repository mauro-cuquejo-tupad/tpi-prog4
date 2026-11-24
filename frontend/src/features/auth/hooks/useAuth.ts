import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { handleApiError } from "@/shared/api/handleApiError";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const loginStore = useAuthStore((s) => s.login);
  const logoutStore = useAuthStore((s) => s.logout);
  const hasRole = useAuthStore((s) => s.hasRole);
  const showNotification = useNotificationStore((s) => s.showNotification);

  const login = async (username: string, pass: string) => {
    try {
      await loginStore(username, pass);
      showNotification("Sesión iniciada correctamente");
    } catch (err: unknown) {
      const msg = handleApiError(err);
      showNotification(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutStore();
      showNotification("Sesión cerrada");
    } catch {
      showNotification("Error al cerrar sesión");
    }
  };

  return {
    user,
    status,
    checkAuth,
    login,
    logout,
    hasRole,
    isAuthenticated: status === "authenticated",
    isChecking: status === "checking",
  };
}

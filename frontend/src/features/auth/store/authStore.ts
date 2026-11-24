import { create } from "zustand";
import { api } from "@/shared/api/api";
import type { Role, User } from "../types/auth.types";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  checkAuth: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (...roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "checking",

  checkAuth: async () => {
    // Se simula pequeña latencia de red (1.5s) para visualizar mejor el estado "checking" y el Spinner
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      const { data } = await api.get<User>("/api/v1/auth/me");
      const normalizedUser: User = {
        ...data,
        roles: data.roles ?? (data.role ? [data.role] : []),
        role: data.role ?? ((data.roles && data.roles.includes("admin")) ? "admin" : "user"),
      };
      set({ user: normalizedUser, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },

  login: async (username: string, password: string) => {
    await api.post("/api/v1/auth/token", new URLSearchParams({ username, password }));
    await get().checkAuth();
  },

  logout: async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } finally {
      set({ user: null, status: "unauthenticated" });
    }
  },

  hasRole: (...roles: Role[]) => {
    const user = get().user;
    if (!user) return false;
    const userRoles: string[] = user.roles ?? (user.role ? [user.role] : []);
    return roles.some((r) => userRoles.includes(r));
  },
}));

export const useEsAdmin = () => useAuthStore((s) => s.hasRole("admin"));

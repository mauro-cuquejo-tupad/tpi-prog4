import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import type { Role } from "@/features/auth";

interface Props {
  allowedRoles?: Role[];
}

export function ProtectedRoute({ allowedRoles }: Props) {
  const status = useAuthStore((s) => s.status);
  const hasRole = useAuthStore((s) => s.hasRole);
  const location = useLocation();

  if (status === "checking") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="inline-flex items-center space-x-3 text-slate-500 dark:text-slate-400">
          <svg
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span className="text-sm font-medium">Verificando sesión…</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsuarios, activarUsuario, desactivarUsuario } from "../services/auth.service";
import type { UsuarioAdmin } from "../types/auth.types";
import { LoadingState, ErrorState, EmptyState, ConfirmModal } from "@/shared/components/SharedModalsAndStates";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { handleApiError } from "@/shared/api/handleApiError";

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const showNotification = useNotificationStore((s) => s.showNotification);
  const [selectedUser, setSelectedUser] = useState<UsuarioAdmin | null>(null);
  const [actionType, setActionType] = useState<"activar" | "desactivar" | null>(null);

  const {
    data: usuarios = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UsuarioAdmin[]>({
    queryKey: ["adminUsers"],
    queryFn: getUsuarios,
  });

  const toggleUserMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: "activar" | "desactivar" }) => {
      if (action === "activar") {
        await activarUsuario(id);
      } else {
        await desactivarUsuario(id);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      showNotification(
        variables.action === "activar"
          ? "Cuenta de usuario activada"
          : "Cuenta de usuario desactivada"
      );
      setSelectedUser(null);
      setActionType(null);
    },
    onError: (err: unknown) => {
      showNotification(handleApiError(err));
    },
  });

  const handleConfirmAction = () => {
    if (selectedUser && actionType) {
      toggleUserMutation.mutate({ id: selectedUser.id, action: actionType });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="pb-6 border-b border-slate-200 dark:border-gray-700 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Administración de Usuarios
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gestión de accesos, roles y estado de cuentas en el sistema
        </p>
      </div>

      {isLoading && <LoadingState message="Cargando usuarios..." />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {!isLoading && !isError && usuarios.length === 0 && (
        <EmptyState message="No hay usuarios registrados en el sistema." />
      )}

      {!isLoading && !isError && usuarios.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
              <thead className="bg-slate-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-slate-200 dark:divide-gray-700">
                {usuarios.map((u) => {
                  const estaActivo = u.deleted_at === null || u.deleted_at === undefined;
                  const esYoMismo = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {u.nombre} {u.apellido}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-1.5 flex-wrap">
                          {u.roles.map((rol) => (
                            <span
                              key={rol}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                rol === "admin"
                                  ? "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                                  : "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              }`}
                            >
                              {rol}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {estaActivo ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300">
                            Desactivado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {esYoMismo ? (
                          <span className="text-slate-400 dark:text-slate-500 text-xs italic">
                            (Cuenta actual)
                          </span>
                        ) : estaActivo ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setActionType("desactivar");
                            }}
                            className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                          >
                            Desactivar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setActionType("activar");
                            }}
                            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-900 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                          >
                            Reactivar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de confirmación de acción */}
      <ConfirmModal
        isOpen={selectedUser !== null && actionType !== null}
        title={actionType === "desactivar" ? "Desactivar cuenta" : "Reactivar cuenta"}
        message={
          actionType === "desactivar"
            ? `¿Estás seguro de que deseás desactivar la cuenta de ${selectedUser?.nombre} ${selectedUser?.apellido}? El usuario no podrá iniciar sesión en el sistema.`
            : `¿Estás seguro de que deseás reactivar el acceso para ${selectedUser?.nombre} ${selectedUser?.apellido}?`
        }
        confirmText={actionType === "desactivar" ? "Desactivar" : "Reactivar"}
        isDestructive={actionType === "desactivar"}
        onConfirm={handleConfirmAction}
        onClose={() => {
          setSelectedUser(null);
          setActionType(null);
        }}
      />
    </div>
  );
};

export default AdminUsersPage;

import React from "react";
import { useEscapeKey } from "@/shared/hooks/useEscapeKey";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = false,
  onConfirm,
  onClose,
}) => {
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-slate-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 mb-3">
          {isDestructive ? (
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title = "Aviso del sistema",
  message,
  buttonText = "Aceptar",
  onClose,
}) => {
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-slate-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{message}</p>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string }> = ({
  message = "Cargando datos...",
}) => (
  <div className="flex items-center justify-center p-12">
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
      <span className="text-sm font-medium">{message}</span>
    </div>
  </div>
);

export const EmptyState: React.FC<{ message?: string }> = ({
  message = "No hay registros disponibles en este momento.",
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 p-8 text-center text-slate-500 dark:text-slate-400">
    <p className="text-sm">{message}</p>
  </div>
);

export const ErrorState: React.FC<{ error: unknown; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => {
  const errorMessage =
    error instanceof Error ? error.message : "Ocurrió un error inesperado al consultar el servidor.";

  return (
    <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 text-sm font-medium">
          <svg className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-semibold px-2.5 py-1 rounded transition-colors"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export const Footer: React.FC<{ autor?: string; anio?: number }> = ({
  autor = "Tecnicatura Universitaria en Programación a Distancia",
  anio = 2026,
}) => {
  return (
    <footer className="flex flex-col bg-slate-900 border-t border-slate-800 text-slate-400 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-col items-center justify-between gap-4 text-sm">
        <p>© {anio} Gestor de Productos. Todos los derechos reservados.</p>
        <p className="text-slate-500 text-xs">{autor}</p>
      </div>
    </footer>
  );
};

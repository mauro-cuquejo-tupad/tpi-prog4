import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { useAuthStore } from "../store/authStore";
import { handleApiError } from "@/shared/api/handleApiError";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname ?? "/";

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setApiError(null);
      setIsSubmitting(true);
      try {
        await login(value.email.trim(), value.password);
        navigate(from, { replace: true });
      } catch (err: unknown) {
        setApiError(handleApiError(err));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl border border-slate-200 dark:border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
            Ingresá con tu cuenta para acceder al sistema
          </p>
        </div>

        {apiError && (
          <div className="rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4 text-sm text-rose-800 dark:text-rose-300">
            {apiError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) =>
                  !value || !value.trim() ? "El correo electrónico es requerido" : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email *
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="usuario@foodstore.com"
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  !value ? "La contraseña es requerida" : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor="login-pass" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Contraseña *
                  </label>
                  <input
                    id="login-pass"
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 block w-full rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  {field.state.meta.errors ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isFormSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isFormSubmitting || isSubmitting}
                className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSubmitting || isFormSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            )}
          </form.Subscribe>

          <div className="text-center text-sm text-slate-600 dark:text-slate-300">
            ¿No tenés una cuenta?{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
              Registrate acá
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

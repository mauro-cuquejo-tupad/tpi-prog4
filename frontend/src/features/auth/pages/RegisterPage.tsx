import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { requestRegister } from "../services/auth.service";
import { useNotificationStore } from "@/store/notificationStore";
import { handleApiError } from "@/shared/api/handleApiError";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      celular: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setApiError(null);
      setIsSubmitting(true);
      try {
        await requestRegister({
          nombre: value.nombre.trim(),
          apellido: value.apellido.trim(),
          email: value.email.trim(),
          celular: value.celular ? value.celular.trim() : undefined,
          password: value.password,
        });
        showNotification("Registro exitoso. Ahora podés iniciar sesión.");
        navigate("/login");
      } catch (err: unknown) {
        setApiError(handleApiError(err));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl border border-slate-200 dark:border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
            Completá tus datos para registrarte
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
          className="mt-8 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="nombre"
              validators={{
                onChange: ({ value }) =>
                  !value || !value.trim() ? "El nombre es requerido" : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor="reg-nombre" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Nombre *
                  </label>
                  <input
                    id="reg-nombre"
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Juan"
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
              name="apellido"
              validators={{
                onChange: ({ value }) =>
                  !value || !value.trim() ? "El apellido es requerido" : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor="reg-apellido" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Apellido *
                  </label>
                  <input
                    id="reg-apellido"
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Pérez"
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

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value || !value.trim() ? "El email es requerido" : undefined,
            }}
          >
            {(field) => (
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email *
                </label>
                <input
                  id="reg-email"
                  type="email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="juan@foodstore.com"
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

          <form.Field name="celular">
            {(field) => (
              <div>
                <label htmlFor="reg-celular" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Celular (opcional)
                </label>
                <input
                  id="reg-celular"
                  type="tel"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="+5491122223333"
                  className="mt-1 block w-full rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "La contraseña es requerida";
                if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres";
                if (value.length > 72) return "La contraseña no puede superar los 72 caracteres";
                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <label htmlFor="reg-pass" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Contraseña (mínimo 8 caracteres) *
                </label>
                <input
                  id="reg-pass"
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

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isFormSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isFormSubmitting || isSubmitting}
                className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer mt-6"
              >
                {isSubmitting || isFormSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            )}
          </form.Subscribe>

          <div className="text-center text-sm text-slate-600 dark:text-slate-300">
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
              Iniciá sesión acá
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

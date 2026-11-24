import React from "react";
import { useThemeStore } from "@/store/themeStore";

export const ThemeToggle: React.FC = () => {
  const darkMode = useThemeStore((s) => s.darkMode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={darkMode}
      onClick={toggleTheme}
      title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        darkMode ? "bg-blue-600" : "bg-slate-700"
      }`}
    >
      <span className="sr-only">Alternar modo oscuro</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          darkMode ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;

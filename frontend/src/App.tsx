import { useEffect } from "react";
import { useAuthStore } from "@/features/auth";
import { AppRouter } from "@/routes/AppRouter";
import { Toast } from "@/shared/components/Toast";
import { Navbar } from "@/shared/components/Navbar";
import { Footer } from "@/shared/components/SharedModalsAndStates";
import { useThemeStore } from "@/store/themeStore";

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const darkMode = useThemeStore((s) => s.darkMode);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${darkMode ? "dark bg-gray-900 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
      <Navbar />
      <main className="flex-1">
        <AppRouter />
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

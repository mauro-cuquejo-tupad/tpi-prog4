import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

export function Toast() {
  const message = useNotificationStore((state) => state.message);
  const show = useNotificationStore((state) => state.show);
  const hideNotification = useNotificationStore((state) => state.hideNotification);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(hideNotification, 3000);
    return () => clearTimeout(timer);
  }, [show, message, hideNotification]);

  if (!show) return null;

  return (
    <div className="fixed top-20 right-6 z-50 max-w-sm rounded-xl bg-slate-900/95 text-white dark:bg-slate-100 dark:text-slate-900 px-5 py-3.5 shadow-2xl border border-slate-700 dark:border-slate-300 text-sm flex items-center space-x-3 backdrop-blur-xs transition-all duration-300 ease-in-out">
      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
      <span className="font-medium leading-relaxed">{message}</span>
    </div>
  );
}

export default Toast;

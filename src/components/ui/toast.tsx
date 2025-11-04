"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

/**
 * ----------------------------------------------------------------------------
 * TOAST COMPONENT
 * ----------------------------------------------------------------------------
 * A lightweight, accessible, auto-dismissable toast notification system.
 *
 * Usage:
 *   showToast("Plan generated!", "success");
 *
 * Features:
 *  ✅ Variants (success, error, info, warning)
 *  ✅ Auto-dismiss
 *  ✅ Dark mode aware
 *  ✅ ARIA live region for accessibility
 *  ✅ Manual close button
 * ----------------------------------------------------------------------------
 */

export type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastProps {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
  error: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700",
  info: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700",
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
};

const Toast: React.FC<ToastProps> = ({ id, message, variant, duration = 4000, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300",
        variantStyles[variant]
      )}
    >
      <span className="flex-shrink-0">{variantIcons[variant]}</span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        aria-label="Close notification"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

/**
 * ----------------------------------------------------------------------------
 * TOAST CONTAINER & HOOK
 * ----------------------------------------------------------------------------
 * Usage:
 *   const { showToast } = useToast();
 *   showToast("Message", "success");
 * ----------------------------------------------------------------------------
 */

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const showToast = (message: string, variant: ToastVariant = "info", duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, variant, duration, onClose: handleClose }]);
  };

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col space-y-3"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

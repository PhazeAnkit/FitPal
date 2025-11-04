"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ----------------------------------------------------------------------------
 * DIALOG (MODAL) COMPONENT
 * ----------------------------------------------------------------------------
 * A fully accessible, reusable modal dialog system.
 * 
 * Features:
 * ✅ Focus trapping (auto focus inside modal)
 * ✅ Esc key to close
 * ✅ Overlay click to close
 * ✅ Dark mode ready
 * ✅ Animation transitions
 * ----------------------------------------------------------------------------
 */

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  showCloseButton = true,
  className,
}) => {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Close when pressing ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Focus trapping: focus first focusable element
  React.useEffect(() => {
    if (open && dialogRef.current) {
      const focusable = dialogRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }
  }, [open]);

  if (!open) return null;

  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Modal Container */}
      <div
        ref={dialogRef}
        className={cn(
          "relative w-full rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up",
          sizeClass,
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between mb-4">
            {title && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="text-gray-700 dark:text-gray-200">{children}</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------
 * Utility animation (optional, add in globals.css)
 * ------------------------------------------------------------
 * @keyframes fade-in-up {
 *   from { opacity: 0; transform: translateY(20px); }
 *   to { opacity: 1; transform: translateY(0); }
 * }
 * .animate-fade-in-up {
 *   animation: fade-in-up 0.25s ease-out forwards;
 * }
 */

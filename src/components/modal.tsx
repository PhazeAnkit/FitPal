"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "info" | "delete" | "warning";
}

export function ConfirmationModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  type = "info",
}: ConfirmationModalProps) {
  if (!open) return null;

  const colorMap = {
    info: "text-indigo-500",
    delete: "text-red-500",
    warning: "text-yellow-500",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-sm relative border border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={onCancel}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className={`text-xl font-semibold mb-3 ${colorMap[type]}`}>
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              {message}
            </p>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button
                variant={type === "delete" ? "destructive" : "primary"}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

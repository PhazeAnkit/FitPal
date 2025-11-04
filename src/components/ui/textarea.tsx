"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * ----------------------------------------------------------------------------
 * TEXTAREA COMPONENT
 * ----------------------------------------------------------------------------
 * A flexible, accessible, and theme-aware multi-line input.
 * Ideal for notes, feedback, or optional user input fields.
 *
 * Features:
 *  ✅ Label + hint text
 *  ✅ Error state with red border and message
 *  ✅ Dark mode styling
 *  ✅ Auto-resizing (optional)
 *  ✅ Fully accessible
 * ----------------------------------------------------------------------------
 */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, hint, error, autoResize = false, rows = 4, ...props },
    ref
  ) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Combine external ref with internal ref
    React.useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    // Auto-resize logic
    React.useEffect(() => {
      if (autoResize && internalRef.current) {
        const el = internalRef.current;
        const resize = () => {
          el.style.height = "auto";
          el.style.height = `${el.scrollHeight}px`;
        };
        resize();
        el.addEventListener("input", resize);
        return () => el.removeEventListener("input", resize);
      }
    }, [autoResize]);

    return (
      <div className="w-full space-y-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={internalRef}
          rows={rows}
          className={cn(
            "w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />

        {/* Hint or Error Message */}
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : hint ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };

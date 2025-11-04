"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

/**
 * ----------------------------------------------------------------------------
 * INPUT COMPONENT
 * ----------------------------------------------------------------------------
 * Reusable, accessible text input field.
 * Works well with react-hook-form or manual state management.
 *
 * Supports:
 *  - Light/Dark mode
 *  - Disabled & ReadOnly
 *  - Error states
 *  - Inline icons (optional)
 * ----------------------------------------------------------------------------
 */

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      type = "text",
      ...props
    },
    ref
  ) => {
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

        {/* Input wrapper (for icons) */}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            aria-invalid={!!error}
            {...props}
          />

          {rightIcon && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={(e) => e.preventDefault()}
            >
              {rightIcon}
            </button>
          )}
        </div>

        {/* Hint or Error Text */}
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : hint ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };

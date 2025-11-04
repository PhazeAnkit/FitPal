"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ----------------------------------------------------------------------------
 * PROGRESS COMPONENT
 * ----------------------------------------------------------------------------
 * A simple, animated progress bar.
 * 
 * Props:
 *  - value: number (0 to 100)
 *  - label?: optional text above bar
 *  - color?: customize progress color
 *  - animated?: smooth transition effect
 * 
 * Features:
 *  ✅ Dark mode support
 *  ✅ Animated transitions
 *  ✅ ARIA accessible
 * ----------------------------------------------------------------------------
 */

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  label?: string;
  color?: "indigo" | "blue" | "green" | "red" | "gray";
  animated?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      label,
      color = "indigo",
      animated = true,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, value));

    // Dynamic color mapping
    const colorMap = {
      indigo: "bg-indigo-600 dark:bg-indigo-500",
      blue: "bg-blue-600 dark:bg-blue-500",
      green: "bg-green-600 dark:bg-green-500",
      red: "bg-red-600 dark:bg-red-500",
      gray: "bg-gray-400 dark:bg-gray-500",
    };

    return (
      <div className="w-full space-y-1">
        {label && (
          <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>{label}</span>
            <span>{percentage}%</span>
          </div>
        )}

        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all",
              animated && "duration-500 ease-out",
              colorMap[color]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";
export { Progress };

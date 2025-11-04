"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import { motion, type HTMLMotionProps } from "framer-motion";

/**
 * ----------------------------------------------------------------------------
 *  BUTTON VARIANTS
 * ----------------------------------------------------------------------------
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-indigo-400",
  {
    variants: {
      variant: {
        default:
          "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200",
        primary:
          "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-600",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700",
        outline:
          "border border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
        ghost:
          "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
        link: "text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-12 px-8 text-base rounded-xl",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * ----------------------------------------------------------------------------
 *  BUTTON PROPS
 * ----------------------------------------------------------------------------
 */
export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "onDrag">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  asChild?: boolean;
}

/**
 * ----------------------------------------------------------------------------
 *  BUTTON COMPONENT
 * ----------------------------------------------------------------------------
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild = false,
      whileTap = { scale: 0.96 },
      whileHover,
      transition = { type: "spring", stiffness: 300, damping: 20 },
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : motion.button;

    // Ensure only a single valid React element for asChild
    if (asChild && (!React.isValidElement(children) || Array.isArray(children))) {
      console.error("[Button] The `asChild` prop requires exactly one valid React element as its child.");
      return null;
    }

    const buttonContent = (
      <>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" aria-hidden="true" />}
        {!isLoading && leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && !isLoading && <span className="ml-2 flex items-center">{rightIcon}</span>}
      </>
    );

    // ---- ✅ Type-safe motion wrapping for asChild ----
    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<Record<string, any>>;
      const MotionWrapper = motion(child.type as React.ElementType);

      return (
        <MotionWrapper
          {...(child.props as Record<string, any>)} // 👈 cast to object type safely
          ref={ref as any}
          whileTap={whileTap}
          whileHover={whileHover}
          transition={transition}
          aria-busy={isLoading}
          aria-disabled={disabled || isLoading}
          disabled={disabled || isLoading}
          className={cn(buttonVariants({ variant, size, className }), child.props?.className)}
        >
          {buttonContent}
        </MotionWrapper>
      );
    }

    // ---- Default motion.button ----
    return (
      <motion.button
        ref={ref}
        type="button"
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        disabled={disabled || isLoading}
        whileTap={whileTap}
        whileHover={whileHover}
        transition={transition}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

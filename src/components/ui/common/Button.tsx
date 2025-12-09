"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "soft" | "white" | "link";
type Size = "sm" | "md" | "lg" | "xs";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  block?: boolean;
  isLoading?: boolean;
  /**
   * When true, the default plus icon is hidden unless a leading/trailing icon is supplied.
   */
  hideDefaultIcon?: boolean;
};

// Preline-inspired base classes
const baseClasses =
  "inline-flex items-center justify-center gap-x-2 rounded-lg font-semibold border border-transparent focus:outline-none disabled:opacity-50 disabled:pointer-events-none transition-all";

// Preline-inspired variant classes
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 dark:focus:bg-blue-700",
  secondary:
    "bg-neutral-800 text-white hover:bg-neutral-900 focus:outline-none focus:bg-neutral-900 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
  outline:
    "border-gray-200 text-gray-800 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
  ghost:
    "text-gray-800 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:focus:bg-neutral-800",
  soft:
    "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 dark:bg-blue-800/30 dark:text-blue-400 dark:hover:bg-blue-800/50 dark:focus:bg-blue-800/50",
  white:
    "bg-white border-gray-200 text-gray-800 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
  link:
    "border-transparent text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:underline dark:text-blue-500 dark:hover:text-blue-400",
};

// Preline-inspired size classes
const sizeClasses: Record<Size, string> = {
  xs: "px-2.5 py-1.5 text-xs",
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-4 py-3 text-base sm:px-5",
};

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  block,
  className = "",
  children,
  isLoading,
  disabled,
  hideDefaultIcon = false,
  ...rest
}: ButtonProps) {
  const computedClassName = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    block ? "w-full" : "",
    (isLoading ?? false) ? "opacity-80" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={computedClassName}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <Spinner size="sm" aria-hidden="true" />
      ) : (
        (leadingIcon ?? (!hideDefaultIcon && (
          <svg
            className="size-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        )))
      )}
      <span className="truncate">{children}</span>
      {trailingIcon}
    </button>
  );
}

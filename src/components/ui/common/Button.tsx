"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

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

const baseClasses =
  "inline-flex items-center justify-center gap-x-2 rounded-lg font-medium focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed transition-all duration-200";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white shadow-2xs hover:bg-blue-500 focus-visible:ring-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400",
  secondary:
    "bg-transparent text-white/80 border border-white/10 hover:bg-white/10 focus-visible:ring-white/40 dark:text-neutral-200",
  outline:
    "border border-gray-200 text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-200 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800",
  ghost:
    "text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
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

"use client";

import { forwardRef, InputHTMLAttributes } from "react";

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Tailwind classes applied to the wrapper; falls back to the default max-width container when omitted.
   */
  containerClassName?: string;
}

const baseContainerClasses = "max-w-sm space-y-3";
const baseInputClasses =
  "py-2.5 sm:py-3 px-4 block w-full border border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600";

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ className = "", containerClassName, type = "text", ...props }, ref) => {
    const containerClasses = containerClassName ?? baseContainerClasses;
    const inputClasses = `${baseInputClasses} ${className}`.trim();

    return (
      <div className={containerClasses}>
        <input ref={ref} type={type} className={inputClasses} {...props} />
      </div>
    );
  }
);

InputText.displayName = "InputText";

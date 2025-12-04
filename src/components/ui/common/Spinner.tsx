"use client";

import type { HTMLAttributes } from "react";

export type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg";
};

const sizeMap: Record<Required<SpinnerProps>["size"], string> = {
  sm: "size-4 border-2",
  md: "size-6 border-[3px]",
  lg: "size-8 border-4",
};

export function Spinner({ size = "md", className = "", ...rest }: SpinnerProps) {
  return (
    <div
      className={[
        "inline-block animate-spin rounded-full border-current border-t-transparent text-blue-600 dark:text-blue-400",
        sizeMap[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      {...rest}
    />
  );
}

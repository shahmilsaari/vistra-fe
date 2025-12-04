"use client";

import type { HTMLAttributes } from "react";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  radius?: "none" | "sm" | "md" | "lg" | "full";
};

const radiusClasses: Record<NonNullable<SkeletonProps["radius"]>, string> = {
  none: "rounded-none",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function Skeleton({
  className = "",
  radius = "md",
  style,
  ...rest
}: SkeletonProps) {
  return (
    <div
      className={[
        "relative overflow-hidden bg-gray-200 dark:bg-neutral-800",
        radiusClasses[radius],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      {...rest}
    >
      <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/5" />
    </div>
  );
}

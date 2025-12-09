"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoadingStore } from "@/stores/loading-store";

export function LoadingBar() {
  const { isLoading, setLoading } = useLoadingStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Route change completed, hide loading
    setLoading(false);
  }, [pathname, searchParams, setLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-neutral-200/50 dark:bg-neutral-800/50">
      <div className="h-full w-full origin-left animate-loading-bar bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500" />
    </div>
  );
}

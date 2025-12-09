"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams ? `?${searchParams}` : ""}`;

    // Trigger custom event for route change completion
    window.dispatchEvent(new CustomEvent("routeChangeComplete", { detail: { url } }));
  }, [pathname, searchParams]);

  return null;
}

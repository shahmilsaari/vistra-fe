import { useRouter as useNextRouter } from "next/navigation";
import { useLoadingStore } from "@/stores/loading-store";
import { useCallback } from "react";

export function useRouterLoading() {
  const router = useNextRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const push = useCallback(
    (href: string) => {
      setLoading(true);
      router.push(href);
    },
    [router, setLoading]
  );

  const replace = useCallback(
    (href: string) => {
      setLoading(true);
      router.replace(href);
    },
    [router, setLoading]
  );

  const back = useCallback(() => {
    setLoading(true);
    router.back();
  }, [router, setLoading]);

  const forward = useCallback(() => {
    setLoading(true);
    router.forward();
  }, [router, setLoading]);

  return {
    push,
    replace,
    back,
    forward,
    refresh: router.refresh,
    prefetch: router.prefetch,
  };
}

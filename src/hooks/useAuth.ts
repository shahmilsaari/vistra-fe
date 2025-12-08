"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores";

export function useAuth(redirectTo: string = "/login") {
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const isHydrated = useUserStore((state) => state.hydrated);

    useEffect(() => {
        if (!isHydrated) return;

        if (!user) {
            router.replace(redirectTo);
        }
    }, [isHydrated, router, redirectTo, user]);

    return {
        user,
        isAuthenticated: Boolean(user),
        isLoading: !isHydrated,
    };
}

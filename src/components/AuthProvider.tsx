"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setGlobalLogoutHandler } from "@/services/api";
import { useUserStore } from "@/stores";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const clearUser = useUserStore((state) => state.clearUser);

    useEffect(() => {
        // Set up global logout handler for 401 responses
        setGlobalLogoutHandler(() => {
            clearUser();
            router.replace("/login");
        });
    }, [clearUser, router]);

    return <>{children}</>;
}

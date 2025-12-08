"use client";

import { clearToken } from "@/lib/session";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type UserStore = {
  user: UserProfile | null;
  hydrated: boolean;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
};

const STORAGE_KEY = "vistra_user";

// Custom cookie storage for Zustand
const cookieStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, {
      expires: 7, // 7 days
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

export const useUserStore = create<UserStore>()(
    persist(
      (set) => ({
        user: null,
        hydrated: false,
        setUser(user) {
          set({ user });
        },
        clearUser() {
          clearToken();
          cookieStorage.removeItem(STORAGE_KEY);
          set({ user: null });
        },
      }),
      {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => cookieStorage),
        partialize: (state) => ({ user: state.user }),
        skipHydration: true,
      }
    )
);

const markHydrated = () => useUserStore.setState({ hydrated: true });

useUserStore.persist.onFinishHydration(markHydrated);

// Manually trigger rehydration so the above listener runs before hydration completes.
// Use a fallback to avoid auth guards getting stuck in a loading state if rehydration fails.
if (typeof window !== "undefined") {
  const rehydrateResult = useUserStore.persist.rehydrate();
  if (rehydrateResult instanceof Promise) {
    void rehydrateResult.finally(markHydrated);
  } else {
    // Older Zustand versions return void; still ensure we mark hydrated.
    markHydrated();
  }
}

import "server-only";
import { cookies } from "next/headers";
import type { UserProfile } from "@/stores/user-store";

const TOKEN_COOKIE = "vistra_token";
const USER_COOKIE = "vistra_user";

const parsePersistedUser = (raw: string | undefined | null): UserProfile | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.state?.user) {
      return parsed.state.user as UserProfile;
    }
    if (parsed?.user) {
      return parsed.user as UserProfile;
    }
  } catch {
    // Ignore malformed cookies and fall back to null.
  }
  return null;
};

export async function getServerAuth() {
  // Turbopack/edge can surface cookies() as a promise or direct object; normalize and guard.
  const cookieStore = await Promise.resolve(cookies());
  const getCookieValue = (name: string) => {
    try {
      return typeof cookieStore.get === "function" ? cookieStore.get(name)?.value ?? null : null;
    } catch {
      return null;
    }
  };

  const token = getCookieValue(TOKEN_COOKIE);
  const user = parsePersistedUser(getCookieValue(USER_COOKIE));
  return { token, user };
}

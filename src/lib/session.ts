import Cookies from "js-cookie";

const TOKEN_KEY = "vistra_token";

function isBrowser() {
  return typeof window !== "undefined";
}

export function setToken(token: string) {
  if (!isBrowser()) {
    return;
  }

  // Store token in cookie with secure settings
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, // 7 days
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function getToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return Cookies.get(TOKEN_KEY) ?? null;
}

export function clearToken() {
  if (!isBrowser()) {
    return;
  }

  Cookies.remove(TOKEN_KEY);
}

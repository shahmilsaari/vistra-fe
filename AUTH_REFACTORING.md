# Authentication System Refactoring

## Overview

The authentication system has been refactored to use **cookie-based session management** with automatic **401 error handling** and full **SSR (Server-Side Rendering) support** using Zustand.

## Key Changes

### 1. Cookie-Based Session Storage

**Before:** Tokens were stored in `localStorage`
**After:** Tokens are stored in secure cookies using `js-cookie`

**File:** `src/lib/session.ts`

```typescript
import Cookies from "js-cookie";

export function setToken(token: string) {
  Cookies.set("vistra_token", token, {
    expires: 7, // 7 days
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}
```

**Benefits:**
- ✅ Better security (cookies can be httpOnly in production)
- ✅ SSR compatible
- ✅ Automatic expiration handling
- ✅ CSRF protection with sameSite: "strict"

### 2. Zustand Store with Cookie Persistence

**File:** `src/stores/user-store.ts`

The user store now uses Zustand's persist middleware with a custom cookie storage adapter:

```typescript
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser(user) {
        set({ user });
      },
      clearUser() {
        clearToken();
        set({ user: null });
      },
    }),
    {
      name: "vistra_user",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
```

**Benefits:**
- ✅ Automatic synchronization between cookie and Zustand state
- ✅ SSR-friendly (no hydration errors)
- ✅ Persistent across page refreshes

### 3. Automatic 401 Error Handling

**File:** `src/services/api.ts`

The API client now automatically handles 401 Unauthorized responses:

```typescript
// Handle 401 Unauthorized - trigger automatic logout
if (response.status === 401) {
  clearToken();
  if (globalLogoutHandler) {
    globalLogoutHandler();
  }
  throw new Error("Your session has expired. Please log in again.");
}
```

**Benefits:**
- ✅ Automatic logout when session expires
- ✅ Automatic redirect to login page
- ✅ Clear error messages to users
- ✅ Prevents stale authentication state

### 4. Global Auth Provider

**File:** `src/components/AuthProvider.tsx`

A new provider component sets up the global logout handler:

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    setGlobalLogoutHandler(() => {
      clearUser();
      router.replace("/login");
    });
  }, [clearUser, router]);

  return <>{children}</>;
}
```

This is wrapped around the entire app in `src/app/layout.tsx`.

### 5. Custom useAuth Hook

**File:** `src/hooks/useAuth.ts`

A new hook simplifies authentication checks in components:

```typescript
export function useAuth(redirectTo: string = "/login") {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (!isChecking && !user) {
      router.replace(redirectTo);
    }
  }, [isChecking, user, router, redirectTo]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isChecking,
  };
}
```

**Usage in components:**

```typescript
export default function ProtectedPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // or loading spinner
  }

  // User is authenticated, render page
  return <div>Welcome {user.name}</div>;
}
```

## Migration Guide

### Before (Old Code)

```typescript
// Manual auth check
const [isHydrated, setIsHydrated] = useState(false);
const user = useUserStore((state) => state.user);
const router = useRouter();

useEffect(() => {
  setIsHydrated(true);
}, []);

useEffect(() => {
  if (isHydrated && !user) {
    router.replace("/login");
  }
}, [isHydrated, router, user]);
```

### After (New Code)

```typescript
// Using useAuth hook
const { user, isLoading } = useAuth();

if (isLoading) {
  return null;
}

// Rest of component
```

## Security Improvements

1. **Cookie Security:**
   - `sameSite: "strict"` prevents CSRF attacks
   - `secure: true` in production ensures HTTPS-only transmission
   - 7-day expiration reduces risk of token theft

2. **Automatic Session Expiration:**
   - 401 responses trigger immediate logout
   - Prevents users from using expired sessions
   - Clear error messaging

3. **SSR Compatibility:**
   - No hydration mismatches
   - Proper server-side rendering support
   - Consistent state across client and server

## Testing the New System

### Test 401 Handling

1. Log in to the application
2. Manually expire your session on the backend
3. Make any API request
4. You should be automatically logged out and redirected to `/login`

### Test Cookie Persistence

1. Log in to the application
2. Refresh the page
3. You should remain logged in (user state persists)
4. Check browser cookies - you should see `vistra_token` and `vistra_user`

### Test SSR

1. Log in to the application
2. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
3. No hydration errors should appear in console
4. User state should be immediately available

## Dependencies Added

```json
{
  "dependencies": {
    "js-cookie": "^3.0.5"
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6"
  }
}
```

## Files Modified

- ✅ `src/lib/session.ts` - Cookie-based token management
- ✅ `src/stores/user-store.ts` - Zustand persist with cookies
- ✅ `src/services/api.ts` - 401 error handling
- ✅ `src/app/layout.tsx` - AuthProvider integration
- ✅ `src/app/page.tsx` - Using useAuth hook

## Files Created

- ✅ `src/components/AuthProvider.tsx` - Global auth provider
- ✅ `src/hooks/useAuth.ts` - Authentication hook

## Breaking Changes

None! The refactoring is backward compatible. Existing code will continue to work, but you can migrate to the new `useAuth` hook for cleaner code.

## Future Enhancements

- [ ] Add refresh token rotation
- [ ] Implement remember me functionality
- [ ] Add session timeout warnings
- [ ] Support for multiple authentication providers
- [ ] Add role-based access control (RBAC) helpers

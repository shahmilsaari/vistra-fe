# Vistra Frontend

Vistra is the React/Next.js frontend for secure document management, folders, and attachment remarks. It pairs the Next.js App Router with isolated feature modules so that the landing shell is server rendered while interactive behaviors (uploads, modals, toasts, drawers) live in client components.

## Tech stack
- **Next.js 16** with the App Router and Turbopack compiler
- **TypeScript** with strict typings at the application boundary
- **Tailwind CSS** for utility-first styling
- **Zustand** for shared client state (user, loading, toasts, tables)
- **FilePond** + related plugins for drag-and-drop uploads
- **Toast + modal primitives** in `src/components/ui` plus global providers

## Architecture at a glance
- **Entry point:** `src/app/layout.tsx` wires `ThemeProvider`, `AuthProvider`, `LoadingBar`, and the toast container so every page has the same shell.
- **App routes:** Server-rendered shells live in `src/app` (`/dashboard`, `/folders`, `/attachments/[id]`, etc.) with client-only children when interactivity is required.
- **Feature modules:** `src/modules/*` group the UI/components/hooks for high-value screens (dashboard, folders, attachments). Each module owns its own README for reference.
- **Services:** `src/services/api.ts` centralizes API calls, handles pagination normalization, and surfaces a single logout handler for 401 responses.
- **Shared state:** Zustand stores under `src/stores/` persist global flags such as the authenticated user, toast queue, loading bar, and UI toggles (table/pagination state).
- **Utilities:** Helpers for formatting, path derivation, and session tokens are under `src/utils` and `src/lib`.

## Getting started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `NEXT_PUBLIC_API_BASE_URL` (and any other secrets) before launching or committing.
3. **Run locally**
   ```bash
   npm run dev
   ```
   The app listens on `http://localhost:3000`; API requests default to `http://localhost:4000/api/v1`.
4. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## Environment configuration
| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the Vistra document API (trailed slash stripped) | `http://localhost:4000/api/v1` |

## Routing, modules, and layout
- All routes live in `src/app/`, which keeps server-rendered shells by default and opts into `"use client"` only when necessary.
- The `modules/` directory hosts fully self-sufficient client screens: UI bits, hooks, and modals live beside each other inside the feature folder.
- Shared components (`components/`) expose providers, navigation guards, theme utilities, and UI primitives that live dynamically in both server and client contexts.
- Global styles land in `src/app/globals.css`; Tailwind configuration is defined in `tailwind.config.ts`.

## API and authentication
- `src/services/api.ts` exposes typed helpers (attachments, folders, remarks, auth) on top of a single `request` wrapper that (1) normalizes envelopes, (2) injects the bearer token from `js-cookie`, and (3) triggers the logout handler on 401.
- The logout handler is wired via `setGlobalLogoutHandler` inside `src/components/AuthProvider.tsx`, which calls `useUserStore().clearUser()` and pushes the router to `/login`.
- Tokens live in cookies managed by `src/lib/session.ts`, and server components can read the persisted user/token using `src/lib/server-auth.ts`.
- Protect new landing shells by checking for authenticated state server-side (via `getServerAuth()`) and redirecting to `/login` when necessary.

## State management and UI flow
- Zustand grains global concerns across multiple stores (`user-store`, `loading-store`, `toast-store`, etc.) located in `src/stores/index.ts`.
- Toasts, modals, drawers, and loading bars are orchestrated through the shared UI store and appear in `components/ui/common`.
- Theme preferences are toggled through `src/components/ThemeProvider` with persisted class switching and CSS variables.

## Testing, linting, and formatting
- Run ESLint before commits: `npm run lint`.
- Formatting is done via Prettier; use `npx prettier --write .` or `npx prettier --check .`.
- New tests should target modular React components or hooks so they stay simple; refer to `src/modules/attachments/README.md` for an example breakdown.

## Deployment and runtime
- Ensure Node 20 is installed (see `.nvmrc` if present, else rely on the recommended version above).
- Set the same environment variables on hosts like Vercel, Render, or your container image before running `npm run start`.
- Static assets live in `public/`; add new assets there if you serve logos or open graph images.

## Supporting documentation
- `docs/architecture.md` – high-level overview of layers, directories, and responsibilities.
- `docs/development.md` – workflow for feature work, debugging, and branch hygiene.
- `docs/testing.md` – guidance on linting, formatting, and validation.

## Contribution notes
- Branch off from `main` with `feature/<short-description>` or `hotfix/<issue>`.
- Keep commits atomic; run lint/format before pushing.
- Update the relevant module README in `src/modules` whenever you touch a feature-heavy area.

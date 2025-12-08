# Vistra Frontend

A Next.js 16 + TypeScript app for managing documents, folders, and attachment remarks. The project uses the App Router with a server-rendered shell (home, folders, attachments) and client components for interactive pieces (uploads, modals, toasts).

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS
- Zustand for state
- FilePond for uploads

## Getting Started
1) Install dependencies:
```bash
npm install
```
2) Set environment:
```bash
cp .env.example .env   # ensure NEXT_PUBLIC_API_BASE_URL is set
```
3) Run dev server:
```bash
npm run dev
```
Open http://localhost:3000

## Node Version
- Recommended: Node.js v20

## Auth & Data
- Auth token and user persist in cookies (`vistra_token`, `vistra_user`).
- Server components read cookies to SSR pages and redirect unauthenticated users to `/login`.
- API calls are centralized in `src/services/api.ts`; 401s trigger logout via a global handler.

## Testing & Linting
```bash
npm run lint
```

## Folder Structure
- `src/app` – route handlers (SSR shells)
- `src/modules` – feature-level client components
- `src/services` – API client
- `src/stores` – Zustand stores
- `src/lib` – shared utilities (server and client)

## Deployment Notes
- Ensure environment vars are set in your host (e.g., Vercel).
- `.gitignore` excludes uploads and non-README markdown.

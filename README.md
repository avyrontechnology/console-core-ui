# console-core-ui

Admin UI for console-core. Next.js 15 + TypeScript (strict) + Tailwind 4 +
Redux Toolkit + simplified NextAuth. Reference: `console-ui` (patterns only —
no copy-paste; known smells documented below and banned by lint).

## Quick start

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_CONSOLE_BASE_URL + AUTH_SECRET
npm install
npm run dev                  # http://localhost:3000
```

## Scripts

| Command                           | What                                                                   |
| --------------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                     | local dev server                                                       |
| `npm run build` / `start`         | production build / serve                                               |
| `npm run typecheck`               | `tsc --noEmit` (strict, noUnusedLocals)                                |
| `npm run lint`                    | Next.js ESLint (`no-explicit-any` = error, `no-console` except logger) |
| `npm run format` / `format:write` | Prettier check / write                                                 |
| `npm run test` / `test:ci`        | Jest + coverage (85% lines/functions/statements, 60% branches)         |

Pre-commit hook (Husky + lint-staged): ESLint fix + Prettier on staged files.

## Structure

```
app/            thin routes only (page = composition, zero logic)
  (admin)/      authenticated shell (sidebar layout)
  login/        public login
  api/auth/     NextAuth handlers
features/<d>/   one folder per domain: api.ts + hooks.ts + components/ + schema.ts
components/ui/  design-system primitives (single table, single form, single filter)
lib/            api-client, endpoints (ONLY place with URLs), env (zod-validated),
                auth (NextAuth), console (shared authed client), logger
store/          Redux: domain data only (app UI state today; session lives in NextAuth)
hooks/          usePermissions (session-sourced, single RBAC reader)
types/          backend-contract mirror (console-core Pydantic schemas)
```

## Rules (enforced)

1. **One resource = one api file + one hook set.** No per-screen thunk duplication.
2. **One table, one form, one filter** in `components/ui/` — column/field defs per feature.
3. **URLs only in `lib/endpoints.ts`.** String literals elsewhere fail review.
4. **Session + permissions only from NextAuth** (`usePermissions`, `ProtectedRoute`). No Redux auth slice, no `localStorage` token.
5. **No `any`, no `console.*`** (logger only). No auth PII in logs.
6. **RBAC slugs are backend slugs** (`console:*`, seeded in console-core DB). Unknown slug = deny.

## Backend contract

- Base: `{CONSOLE_BASE_URL}/console-service/v1`, Bearer JWT.
- Login: `POST /do_login?svc_name=console {credential, password}` → `{access_token}` → `GET /partner_homepage_details` hydrates session (permissions/partner/services).
- IDs are UUID strings. Contract drift: compare `lib/endpoints.ts` against backend `/openapi.json` in CI (planned).

# Agent Guidelines: console-core-ui Software Factory

This repository enforces **Spec-Driven Development (SDD)** with strict **shadcn UI components** and automated verification **harnesses**. All AI agents operating in this workspace must adhere to the rules below.

---

## 1. Spec-Driven Development Mandate

1. **No Code Without a Spec**: Never write production feature code or page routes without an active specification in `specs/active/<feature>/spec.md` and a task tracker in `specs/active/<feature>/tasks.md`.
2. **Scaffold with Factory**: To start any new feature, run:
   ```bash
   npm run factory:new <feature-slug>
   ```
3. **Phased Execution**: Follow the 5 phases in `tasks.md`:
   - Phase 1: Contract, Types & Endpoints
   - Phase 2: API Client & Hooks + Unit Tests
   - Phase 3: Strict Shadcn UI Components & Page
   - Phase 4: Acceptance Criteria Tests & Coverage (>= 85%)
   - Phase 5: Software Factory Loop (`npm run factory:loop <feature-slug>`)

---

## 2. Strict Shadcn UI Components Rule

1. **Only Shadcn Primitives**: All visual controls, form elements, buttons, dialogs, cards, badges, and layout primitives **MUST** strictly be imported from `@/components/ui/<component>` (e.g., `@/components/ui/button`, `@/components/ui/card`, `@/components/ui/dialog`, `@/components/ui/input`, `@/components/ui/field`, `@/components/ui/table`, `@/components/ui/badge`).
2. **Zero Raw Form Controls**: Raw HTML tags (`<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`) or unapproved custom primitives in feature files are strictly prohibited and will fail the `shadcn-harness`.
3. **Component Manifest**: Every specification must explicitly declare which shadcn components are used and why.

---

## 3. Architectural Invariants

1. **URLs strictly in `lib/endpoints.ts`**: Never hardcode endpoint URLs (e.g. `/console-service/v1/...`). Add all endpoint constants as functions in `lib/endpoints.ts`.
2. **Domain Feature Slicing**: One resource domain = `features/<domain>/` with `api.ts`, `hooks.ts`, `schema.ts`, and `components/`.
3. **Strict Typing**: Zero `any` allowed. Mirror backend contracts in `types/<domain>.ts`.
4. **No Console Logs**: Zero `console.log`. Use structured logging via `import { logger } from "@/lib/logger"`.
5. **RBAC Protection**: Use exact backend slugs (`console:*`). Unknown slugs are denied. Wrap admin routes in `<ProtectedRoute requiredPermission="console:<slug>">`.

---

## 4. The Factory Feedback Loop

Always verify changes using the software factory loop:

```bash
npm run factory:loop <feature-slug>
```

If any harness fails, read `specs/active/<feature-slug>/harness-report.json`, repair the code based on the diagnostic feedback, and re-run until all 4 stages are green.

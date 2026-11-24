---
name: software-factory
description: Software Factory and Spec-Driven Development workflow for console-core-ui. Use whenever creating new features, modifying UI components with strict shadcn UI, breaking down tasks, or running verification harnesses and loops.
---

# console-core-ui Software Factory Skill

This skill teaches agents how to implement features, perform refactors, and audit code in `@obotaai/console-core-ui` using the **Spec-Driven Software Factory**.

---

## 1. When to Use This Skill

Activate this skill when:

- Creating a new feature or sub-feature in the admin console.
- Adding or modifying UI components (strictly using shadcn UI).
- Adding new backend contract endpoints.
- Verifying code quality against repository harnesses and test coverage.

---

## 2. Step-by-Step Factory Procedure

### Step 1: Scaffold Specification

Run the factory scaffolding command:

```bash
npm run factory:new <feature-slug>
```

This generates:

- `specs/active/<feature-slug>/spec.md`
- `specs/active/<feature-slug>/tasks.md`

### Step 2: Author Specification & Shadcn Component Manifest

Open `specs/active/<feature-slug>/spec.md` and complete:

1. **Backend Contract**: Specify HTTP method, path, and register the endpoint in `lib/endpoints.ts`.
2. **Types**: Define TypeScript interfaces in `types/<domain>.ts`.
3. **Strict Shadcn Manifest**: Identify which shadcn components will be used:
   - Form inputs: `@/components/ui/input`, `@/components/ui/field`, `@/components/ui/label`
   - Actions: `@/components/ui/button`
   - Panels: `@/components/ui/card`
   - Modals: `@/components/ui/dialog`, `@/components/ui/alert-dialog`
   - Tables: `@/components/ui/table`
   - Statuses: `@/components/ui/badge`
4. **RBAC Slugs**: Specify exact `console:<action>` permissions.
5. **Acceptance Criteria**: Gherkin format scenarios.

Validate the spec:

```bash
npm run factory:spec specs/active/<feature-slug>
```

### Step 3: Implement Phased Tasks (Test-First)

Follow `specs/active/<feature-slug>/tasks.md`:

1. Register endpoints in `lib/endpoints.ts`.
2. Implement `features/<domain>/api.ts` and write `api.test.ts`.
3. Implement `features/<domain>/hooks.ts` and write `hooks.test.tsx`.
4. Compose domain components in `features/<domain>/components/` strictly using shadcn UI components.
5. Compose the page in `app/(admin)/<route>/page.tsx` with `<ProtectedRoute>`.
6. Write page tests in `app/(admin)/<route>/page.test.tsx`.

### Step 4: Run the Software Factory Feedback Loop

Run the unified verification loop:

```bash
npm run factory:loop <feature-slug>
```

The loop runs 4 automated harnesses:

- **Spec Harness**: Validates spec completeness and endpoint references.
- **Shadcn Harness**: Ensures zero raw HTML form controls and strict shadcn UI imports.
- **Architecture Harness**: Enforces URLs in `lib/endpoints.ts`, zero `any`, and zero `console.log`.
- **Test Harness**: Runs TypeScript check, ESLint, and Jest test coverage (>= 85%).

If any harness fails, inspect `specs/active/<feature-slug>/harness-report.json`, repair the code, and re-run.

### Step 5: Complete & Archive

Once all items in `tasks.md` are checked and the loop passes:

```bash
npm run factory:complete <feature-slug>
```

This moves the spec to `specs/completed/<feature-slug>/` as permanent living documentation.

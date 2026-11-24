# Spec-Driven Development (SDD) & Software Factory Guide

Welcome to the **Software Factory** for `@obotaai/console-core-ui`.

This repository operates on a strict **Spec-Driven Development (SDD)** model. No feature, domain enhancement, or architectural refactor is built without a validated specification blueprint.

---

## The Software Factory Lifecycle

Every feature flows through 5 disciplined phases governed by automated **Harnesses** and self-correcting **Loops**:

```
1. SPECIFY ──► 2. INVENTORY (Shadcn) ──► 3. HARNESS LOOP ──► 4. VERIFY ──► 5. COMPLETE
   (spec.md)       (Strict UI Manifest)    (Self-Correction)   (All Green)    (Archive)
```

1. **Phase 1: Specify (`specs/active/<feature>/spec.md`)**
   - Define Problem Statement, Scope, and User Stories.
   - Mirror backend contract (OpenAPI method, path, request/response types in `types/<domain>.ts`).
   - Register endpoint constants in `lib/endpoints.ts`.
   - Map RBAC slugs (`console:*`).
   - Write Gherkin-style Acceptance Criteria.

2. **Phase 2: Shadcn UI Component Manifest**
   - **STRICT REQUIREMENT**: All interactive and visual elements must strictly use shadcn UI components (`@/components/ui/<component>`).
   - Every spec must contain a Shadcn Component Manifest detailing each component used (e.g. `button`, `card`, `dialog`, `input`, `table`, `badge`, `sheet`, `sidebar`).
   - Raw HTML tags (`<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`) or unapproved custom primitives are banned and caught by the `shadcn-harness`.

3. **Phase 3: Task Breakdown (`specs/active/<feature>/tasks.md`)**
   - Phased, atomic task checklist:
     - Phase 1: Contract, Types & Endpoints
     - Phase 2: API Client (`features/<domain>/api.ts`) & Hooks (`features/<domain>/hooks.ts`) + Unit Tests
     - Phase 3: Components (`features/<domain>/components/`) & Pages (`app/(admin)/<domain>/`)
     - Phase 4: Acceptance Criteria Tests & Coverage Threshold
     - Phase 5: Factory Verification & Sign-off

4. **Phase 4: The Factory Loop (`npm run factory:loop <feature>`)**
   - Runs the 4 factory harnesses:
     1. `spec-harness`: Validates spec metadata, OpenAPI contract, RBAC slugs, and shadcn manifest.
     2. `shadcn-harness`: AST & regex audit verifying strict shadcn component imports and zero raw HTML tags.
     3. `arch-harness`: Verifies URLs only in `lib/endpoints.ts`, zero `any`, and zero `console.log`.
     4. `test-harness`: Verifies TypeScript compilation (`tsc --noEmit`), ESLint, and Jest test coverage (>= 85%).
   - If any harness fails, the loop outputs a diagnostic report (`specs/active/<feature>/harness-report.json`) detailing line-by-line fixes.
   - Developers and AI agents iterate in this feedback loop until 100% compliant.

5. **Phase 5: Complete & Archive (`npm run factory:complete <feature>`)**
   - Ensures all tasks in `tasks.md` are marked completed `[x]`.
   - Runs the complete verification pipeline.
   - Moves the spec from `specs/active/` to `specs/completed/` to serve as permanent living documentation.

---

## CLI Commands

| Command                                   | Description                                                                      |
| :---------------------------------------- | :------------------------------------------------------------------------------- |
| `npm run factory:new <feature-slug>`      | Scaffolds a new active specification and task checklist from templates           |
| `npm run factory:loop <feature-slug>`     | Runs the full software factory evaluation loop and generates a diagnostic report |
| `npm run factory:spec <feature-slug>`     | Runs only the Spec Harness                                                       |
| `npm run factory:shadcn`                  | Runs only the Shadcn Component Usage Harness across the codebase                 |
| `npm run factory:arch`                    | Runs only the Architecture & Invariants Harness                                  |
| `npm run factory:test`                    | Runs the Test Harness (typecheck, lint, Jest with 85% coverage)                  |
| `npm run factory:complete <feature-slug>` | Verifies all harnesses and archives an active spec to completed                  |
| `npm run factory:verify`                  | Audits the entire codebase against all factory harnesses                         |

---

## Directory Organization

```
specs/
├── README.md                          # This guide
├── templates/
│   ├── feature-spec.md                # Standard feature specification blueprint
│   └── tasks.md                       # Standard phased task tracker
├── active/                            # In-progress features
│   └── <feature-slug>/
│       ├── spec.md
│       ├── tasks.md
│       └── harness-report.json        # Output by factory:loop
└── completed/                         # Completed, verified specs (Living Docs)
    └── 001-partners-management/
        ├── spec.md
        └── tasks.md
```

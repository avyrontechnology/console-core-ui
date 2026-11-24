# Tasks: [Feature Name]

Specification: `specs/active/[feature-slug]/spec.md`
Status: `In Progress`

---

## Phase 1: Contract, Types & Endpoints

- [ ] Register API endpoint in `lib/endpoints.ts`
- [ ] Define backend mirror interfaces in `types/[domain].ts`
- [ ] Write Zod validation schemas in `features/[domain]/schema.ts`
- [ ] Run `npm run factory:arch` to verify endpoint compliance

## Phase 2: API Client & Hooks

- [ ] Implement `features/[domain]/api.ts` using `consoleApi`
- [ ] Write unit tests for API in `features/[domain]/api.test.ts`
- [ ] Implement query & mutation hooks in `features/[domain]/hooks.ts`
- [ ] Write hook tests in `features/[domain]/hooks.test.tsx`

## Phase 3: Shadcn UI Components & Page Composition

- [ ] Review Shadcn Component Manifest from `spec.md`
- [ ] Implement domain form/table components in `features/[domain]/components/`
- [ ] Verify zero raw HTML tags (`<button>`, `<input>`, etc.) are used
- [ ] Compose admin page in `app/(admin)/[route]/page.tsx`
- [ ] Wrap page in `<ProtectedRoute requiredPermission="console:[slug]">`

## Phase 4: Acceptance Criteria & Coverage Verification

- [ ] Write integration/page tests in `app/(admin)/[route]/page.test.tsx`
- [ ] Verify Scenario 1 (Successful Data Retrieval)
- [ ] Verify Scenario 2 (Validation Errors)
- [ ] Verify Scenario 3 (Unauthorized Access Gate)
- [ ] Verify Jest test coverage meets thresholds (>= 85% statements/lines, >= 80% functions)

## Phase 5: Software Factory Loop & Sign-off

- [ ] Run `npm run factory:loop [feature-slug]` and ensure all 4 harnesses pass
- [ ] Run `npm run typecheck` (0 errors)
- [ ] Run `npm run lint` (0 errors)
- [ ] Complete feature transition: `npm run factory:complete [feature-slug]`

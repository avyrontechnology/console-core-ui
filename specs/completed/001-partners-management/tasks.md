# Tasks: Partner Management

Specification: `specs/completed/001-partners-management/spec.md`
Status: `Completed`

---

## Phase 1: Contract, Types & Endpoints

- [x] Register API endpoints in `lib/endpoints.ts`
- [x] Mirror backend types in `types/partner.ts`
- [x] Define validation schemas in `features/partners/schema.ts`
- [x] Run `npm run factory:arch`

## Phase 2: API Client & Hooks

- [x] Implement `features/partners/api.ts`
- [x] Write `features/partners/api.test.ts`
- [x] Implement `features/partners/hooks.ts`
- [x] Write `features/partners/hooks.test.tsx`

## Phase 3: Shadcn UI Components & Page Composition

- [x] Create `PartnerTable.tsx` using `@/components/ui/badge` and `@/components/ui/table`
- [x] Create `PartnerForm.tsx` using `@/components/ui/button` and `@/components/ui/field`
- [x] Compose `app/(admin)/partners/page.tsx`
- [x] Compose `app/(admin)/partners/new/page.tsx`
- [x] Compose `app/(admin)/partners/[id]/page.tsx`

## Phase 4: Acceptance Criteria & Coverage Verification

- [x] Write tests in `app/(admin)/partners/pages.test.tsx`
- [x] Verify Scenario 1 (List Partners)
- [x] Verify Scenario 2 (Create Partner)
- [x] Achieve > 85% coverage threshold

## Phase 5: Software Factory Loop & Sign-off

- [x] Pass all harnesses in `npm run factory:loop`
- [x] Verified by Console Core Team

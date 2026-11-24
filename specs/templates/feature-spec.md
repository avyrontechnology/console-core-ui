# Specification: [Feature Name]

| Field            | Value                          |
| :--------------- | :----------------------------- |
| **Feature Slug** | `[feature-slug]`               |
| **Domain**       | `features/[domain]`            |
| **Status**       | `Draft` <!-- Options: Draft    | In Review | Approved | In Progress | Implemented | Verified --> |
| **Author**       | `[author-name]`                |
| **Target Route** | `app/(admin)/[route]/page.tsx` |
| **RBAC Slugs**   | `console:[permission_slug]`    |

---

## 1. Problem Statement & Scope

### 1.1 Context & Problem

[Describe what user pain point or system requirement this feature addresses.]

### 1.2 User Personas & Use Cases

- **Persona**: [e.g. Platform Administrator]
- **Primary Use Case**: [e.g. View, filter, and manage API keys for a partner]

### 1.3 Goals & Non-Goals

- **Goals**:
  - [Goal 1]
  - [Goal 2]
- **Non-Goals**:
  - [Out of scope item 1]

---

## 2. Backend Contract & Data Models

### 2.1 Endpoint Registration (`lib/endpoints.ts`)

_Enforced Rule: All URLs must reside in `lib/endpoints.ts`._

```typescript
// Registered in lib/endpoints.ts
ENDPOINTS.[ENDPOINT_NAME] = (id?: string) => `...`;
```

- **HTTP Method**: `GET` | `POST` | `PATCH` | `DELETE`
- **Path**: `/console-service/v1/...`
- **Query / Body Parameters**:
  - [Param 1]: `type` "required/optional"

### 2.2 Data Types & Pydantic Schema Mirror (`types/[domain].ts`)

```typescript
export interface [ResourceName] {
  id: string;
  // backend mirror fields
}
```

### 2.3 Form & Input Validation Schemas (`features/[domain]/schema.ts`)

```typescript
import { z } from "zod";

export const [featureSchema] = z.object({
  // zod validation rules
});

export type [FeatureInput] = z.infer<typeof [featureSchema]>;
```

---

## 3. Strict Shadcn UI Component Manifest

_Enforced Rule: All visual controls and primitives must strictly use shadcn UI components from `@/components/ui/`. Zero raw `<button>`, `<input>`, or unstyled HTML tags._

| Shadcn Component                    | Import Path              | Purpose in this Feature                     |
| :---------------------------------- | :----------------------- | :------------------------------------------ |
| `Button`                            | `@/components/ui/button` | Form submission, primary actions, cancel    |
| `Card`, `CardHeader`, `CardContent` | `@/components/ui/card`   | Surface containers for stats and forms      |
| `Input`                             | `@/components/ui/input`  | Text, email, and numeric inputs             |
| `Field`, `FieldLabel`, `FieldError` | `@/components/ui/field`  | Accessible form field wrappers              |
| `Dialog` / `AlertDialog`            | `@/components/ui/dialog` | Destructive confirmations and modal dialogs |
| `Table`, `TableHeader`, `TableBody` | `@/components/ui/table`  | Data list rendering                         |
| `Badge`                             | `@/components/ui/badge`  | Status indicators and tags                  |
| `Select`, `SelectItem`              | `@/components/ui/select` | Dropdown selections                         |

---

## 4. UI/UX State Matrix

Every state must be explicitly handled in UI and verified in tests:

| State                      | Trigger Condition         | Visual Presentation & Shadcn Elements      |
| :------------------------- | :------------------------ | :----------------------------------------- |
| **Idle / Initial**         | Component mounted         | Base page shell with `PageHeader`          |
| **Loading**                | Fetch request pending     | Shadcn `Skeleton` loaders or spinner       |
| **Empty**                  | Response contains 0 items | Empty state placeholder with action button |
| **Data Rendered**          | Successful payload        | Shadcn `Table` or `Card` grid with items   |
| **Error (Network/Server)** | API returned 4xx/5xx      | Destructive alert or toast via `sonner`    |
| **Unauthorized (403)**     | Missing RBAC permission   | Handled by `ProtectedRoute` / Denied view  |

---

## 5. Architecture & File Plan

- `lib/endpoints.ts`: Register endpoint constant
- `types/[domain].ts`: TypeScript contract mirror
- `features/[domain]/api.ts`: API client functions using `consoleApi`
- `features/[domain]/hooks.ts`: React query/state hooks (`use[Resource]`, mutations)
- `features/[domain]/components/`: Domain-specific components composed of shadcn primitives
- `app/(admin)/[route]/page.tsx`: Page route protected with `<ProtectedRoute requiredPermission="...">`

---

## 6. Acceptance Criteria (Gherkin Format)

### Scenario 1: Successful Data Retrieval

- **Given** an authenticated user with `console:[permission_slug]` permission
- **When** navigating to `[target-route]`
- **Then** the page calls `ENDPOINTS.[ENDPOINT_NAME]`
- **And** renders data inside the shadcn `Table`

### Scenario 2: Validation Error on Form Submission

- **Given** an invalid form input
- **When** the user clicks the submit `Button`
- **Then** inline field errors are displayed via `FieldError`
- **And** no API request is sent

### Scenario 3: Unauthorized Access Gate

- **Given** a user lacking `console:[permission_slug]`
- **When** attempting to access `[target-route]`
- **Then** access is denied by `ProtectedRoute`

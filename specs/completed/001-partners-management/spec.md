# Specification: Partner Management

| Field            | Value                                                                                                    |
| :--------------- | :------------------------------------------------------------------------------------------------------- |
| **Feature Slug** | `001-partners-management`                                                                                |
| **Domain**       | `features/partners`                                                                                      |
| **Status**       | `Verified`                                                                                               |
| **Author**       | `Console Core Team`                                                                                      |
| **Target Route** | `app/(admin)/partners/page.tsx`                                                                          |
| **RBAC Slugs**   | `console:get_all_partners`, `console:create_partner`, `console:update_partner`, `console:delete_partner` |

---

## 1. Problem Statement & Scope

### 1.1 Context & Problem

Console Core UI serves as the central administrative hub for managing B2B partner organizations. Administrators require a centralized view to inspect partner accounts, onboard new partners, edit company legal information, and toggle partner activation status.

### 1.2 User Personas & Use Cases

- **Super Administrator**: Creates, reviews, toggles, and deletes partner accounts.
- **Support Engineer**: Views partner status and active licenses.

### 1.3 Goals & Non-Goals

- **Goals**:
  - Paginated list of partners with company legal names and license counts.
  - Detail view with editable attributes and live toggle for activation.
  - Creation form with strict validation.
- **Non-Goals**:
  - Billing setup or payment gateway config (handled in `features/payments`).

---

## 2. Backend Contract & Data Models

### 2.1 Endpoint Registration (`lib/endpoints.ts`)

```typescript
ENDPOINTS.PARTNERS = () => `/console-service/v1/partners`;
ENDPOINTS.PARTNER_BY_ID = (id: string) => `/console-service/v1/partners/${id}`;
ENDPOINTS.PARTNER_CREATE = () => `/console-service/v1/partners`;
ENDPOINTS.PARTNER_UPDATE = (id: string) => `/console-service/v1/partners/${id}`;
ENDPOINTS.PARTNER_DELETE = (id: string) => `/console-service/v1/partners/${id}`;
ENDPOINTS.PARTNER_TOGGLE_ACTIVATION = (id: string) =>
  `/console-service/v1/partners/${id}/toggle_activation`;
```

- **HTTP Methods**: `POST` (list with filter body), `GET` (by ID), `POST` (create), `PATCH` (update/activation), `DELETE` (delete).

### 2.2 Data Types & Pydantic Schema Mirror (`types/partner.ts`)

```typescript
export interface Partner {
  id: string;
  name: string;
  company_legal_name?: string | null;
  is_active: boolean;
  active_license?: number | null;
}

export interface PaginatedPartners {
  total_count: number;
  limit: number;
  offset: number;
  partners_data: Partner[];
}
```

### 2.3 Form Validation Schemas (`features/partners/schema.ts`)

```typescript
import { z } from "zod";

export const createPartnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company_legal_name: z.string().optional(),
});
```

---

## 3. Strict Shadcn UI Component Manifest

| Shadcn Component        | Import Path              | Purpose in this Feature                                  |
| :---------------------- | :----------------------- | :------------------------------------------------------- |
| `Button`                | `@/components/ui/button` | "Create partner", "Save", "Deactivate", "Delete" buttons |
| `Card`, `CardContent`   | `@/components/ui/card`   | Form panels and detail cards                             |
| `Input`                 | `@/components/ui/input`  | Partner name and company legal name inputs               |
| `Field`, `FieldLabel`   | `@/components/ui/field`  | Form label and input field composition                   |
| `Badge`                 | `@/components/ui/badge`  | "Active" / "Inactive" status pills                       |
| `Dialog`, `AlertDialog` | `@/components/ui/dialog` | Confirm deletion modal                                   |
| `Table`                 | `@/components/ui/table`  | Partner list display                                     |

---

## 4. UI/UX State Matrix

| State             | Trigger Condition                     | Visual Presentation & Shadcn Elements                         |
| :---------------- | :------------------------------------ | :------------------------------------------------------------ |
| **Loading**       | Initial API fetch in progress         | Skeleton rows in table                                        |
| **Empty**         | `total_count === 0`                   | Empty state message with "Add Partner" button                 |
| **Data Rendered** | Partners array populated              | Shadcn table with status badge and click-to-detail navigation |
| **Error**         | API failure                           | Error banner with retry button                                |
| **Forbidden**     | User lacks `console:get_all_partners` | Access denied page                                            |

---

## 5. Acceptance Criteria

### Scenario 1: List Partners

- **Given** an authenticated user with `console:get_all_partners`
- **When** the partners page loads
- **Then** `POST /console-service/v1/partners` is invoked
- **And** all partners are rendered in rows with their activation badge

### Scenario 2: Create Partner

- **Given** valid partner input
- **When** clicking "Create partner"
- **Then** `POST /console-service/v1/partners` is sent with payload
- **And** user is redirected to the detail page

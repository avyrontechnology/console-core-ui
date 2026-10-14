/** RBAC domain contracts (mirror of console-core auth schemas). */

export interface Role {
  id: string;
  name: string;
  slug: string;
  hierarchy?: number | null;
  description?: string | null;
  is_active: boolean;
  is_internal?: boolean | null;
}

export interface Permission {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  display_text?: string | null;
  is_active: boolean;
}

export interface CreateRoleInput {
  name: string;
  slug: string;
  hierarchy: number;
  description: string;
  is_internal?: boolean;
}

export type UpdateRoleInput = Partial<Pick<Role, "name" | "slug" | "hierarchy" | "description">>;

export interface MatrixPermission {
  id: string;
  description?: string | null;
  display_text?: string | null;
  created_at?: number | null;
  is_default: boolean;
}

export type PermissionMatrix = Record<string, Record<string, Record<string, MatrixPermission>>>;

export interface MatrixResponse {
  default_role_permission: PermissionMatrix;
}

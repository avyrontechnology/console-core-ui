/** User domain contracts (mirror of console-core user/auth schemas). */

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  alternate_phone_number?: string | null;
  designation?: string | null;
  partner_id: string | null;
  role_id: string | null;
  parent_id?: string | null;
  country_id?: string | null;
  state_id?: string | null;
  city_id?: string | null;
  is_active?: boolean | null;
  is_staff?: boolean | null;
  is_admin?: boolean | null;
  is_suspended?: boolean | null;
  is_internal?: boolean | null;
  current_status?: string | null;
}

export interface UserListParams {
  offset?: number;
  limit?: number;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  partner_id: string;
  role_id: string;
  designation?: string;
  parent_id?: string | null;
}

export type UpdateUserInput = Partial<
  Pick<
    User,
    | "name"
    | "email"
    | "phone_number"
    | "designation"
    | "partner_id"
    | "role_id"
    | "parent_id"
    | "is_active"
  >
>;

export interface Role {
  id: string;
  name: string;
  slug: string;
  hierarchy?: number | null;
  description?: string | null;
  is_active: boolean;
}

/** GET /users returns a paginated envelope, not a bare array. */
export interface PaginatedUsers {
  total_count: number;
  limit: number;
  offset: number;
  users_data: User[];
}

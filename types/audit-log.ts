/** Audit log domain contracts (mirror of console-core audit_log schemas). */

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resource_id?: string | null;
  performed_by?: string | null;
  resource_previous_state?: string | null;
  resource_current_state?: string | null;
  details?: string | null;
  created_at?: number | null;
}

export interface AuditLogFilters {
  resource?: string;
  action?: string;
  limit?: number;
  offset?: number;
}

export const AUDIT_ACTIONS = ["CREATE", "UPDATE", "DELETE", "DENY", "GRANT", "REVOKE"] as const;

export const AUDIT_RESOURCES = [
  "USER",
  "PARTNER",
  "AUTH",
  "ROLE",
  "PERMISSION",
  "PARTNER_ADDRESS",
  "PARTNER_META_DATA",
  "PARTNER_ROLE_PERMISSION",
  "USER_META_DATA",
  "CONSTANT",
  "DEFAULT_ROLE_PERMISSION",
  "API_KEY",
  "WALLET",
  "ORDER",
  "PLAN",
] as const;

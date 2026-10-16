/** API key domain contracts (mirror of console-core api_key schemas). */

export interface ApiKey {
  id: string;
  key: string;
  description?: string | null;
  scopes?: string[] | null;
  user_context?: Record<string, unknown> | null;
  is_active: boolean;
  expires_at?: number | null;
  partner_id: string;
}

export interface RotateKeyInput {
  scopes?: string[];
  expires_at?: number | null;
}

export interface UpdateKeyInput {
  scopes?: string[] | null;
  expires_at?: number | null;
}

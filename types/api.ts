/** Backend contract mirror (console-core Pydantic schemas).
 *  Keep in sync manually; contract-check CI compares endpoint list.
 *  IDs are UUID strings over the wire.
 */

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface TokenPair {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  credential: string;
  password: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  partner_id: string | null;
  role_id: string | null;
}

export interface PartnerInfo {
  partner_id: string;
  partner_name?: string | null;
  subscription_mode?: string | null;
}

export interface HomepageData {
  user_info: UserInfo;
  user_permissions: string[];
  partner_info: PartnerInfo | null;
  services_info: Record<string, unknown> | null;
}

import { getEnv } from "./env";

const API_PREFIX = "/console-service/v1";

function url(path: string): string {
  return `${getEnv().NEXT_PUBLIC_CONSOLE_BASE_URL}${API_PREFIX}${path}`;
}

/** All backend URLs, in one place. No string literals elsewhere. */
export const ENDPOINTS = {
  LOGIN: () => url("/do_login?svc_name=console"),
  LOGOUT: () => url("/logout"),
  HOMEPAGE_DETAILS: () => url("/partner_homepage_details"),
  DASHBOARD_CARDS: () => url("/partner_dashboard_cards"),
  USERS: (params?: { offset?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.offset !== undefined) query.set("offset", String(params.offset));
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    const suffix = query.toString();
    return url(`/users${suffix ? `?${suffix}` : ""}`);
  },
  USER_BY_ID: (id: string) => url(`/user/get_by_id/${id}`),
  USER_CREATE: () => url("/do_signup?svc_name=console"),
  USER_UPDATE: (id: string) => url(`/user/${id}`),
  USER_DELETE: (id: string) => url(`/user/${id}`),
  ROLES: () => url("/role"),
  PARTNERS: () => url("/partners"),
  PARTNER_BY_ID: (id: string) => url(`/partner/${id}`),
  PARTNER_CREATE: () => url("/create_partner"),
  PARTNER_UPDATE: (id: string) => url(`/partner/${id}`),
  PARTNER_DELETE: (id: string) => url(`/partner/${id}`),
  PARTNER_TOGGLE_ACTIVATION: (id: string) => url(`/partner/${id}/toggle_activation`),
  ROLES_LIST: () => url("/role"),
  ROLE_CREATE: () => url("/role"),
  ROLE_BY_ID: (id: string) => url(`/role/${id}`),
  ROLE_UPDATE: (id: string) => url(`/role/${id}`),
  ROLE_DELETE: (id: string) => url(`/role/${id}`),
  PERMISSIONS_LIST: () => url("/permission"),
  PERMISSION_MATRIX: () => url("/get_permissions_for_all_roles"),
  ROLE_ACTION_PERMISSIONS: (roleId: string) =>
    url(`/default_role_permission/role/${roleId}/action-permissions`),
  PLANS: (params?: { service_name?: string; plan_type?: string }) => {
    const query = new URLSearchParams();
    if (params?.service_name) query.set("service_name", params.service_name);
    if (params?.plan_type) query.set("plan_type", params.plan_type);
    const suffix = query.toString();
    return url(`/get-plans${suffix ? `?${suffix}` : ""}`);
  },
  PLAN_BY_ID: (id: string) => url(`/get-plan-by-id/${id}`),
  PLAN_CREATE: () => url("/create-plan"),
  PLAN_UPDATE: (id: string) => url(`/update-plan/${id}`),
  PLAN_DELETE: (id: string) => url(`/delete-plan/${id}`),
  PLAN_MODULES: () => url("/get-modules"),
  ORDERS_HISTORY: (params?: {
    partner_ids?: string;
    limit?: number;
    offset?: number;
    source?: string;
    status?: string;
    is_manually_created?: boolean;
    order_type?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.partner_ids) query.set("partner_ids", params.partner_ids);
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    if (params?.offset !== undefined) query.set("offset", String(params.offset));
    if (params?.source) query.set("source", params.source);
    if (params?.status) query.set("status", params.status);
    if (params?.is_manually_created !== undefined)
      query.set("is_manually_created", String(params.is_manually_created));
    if (params?.order_type) query.set("order_type", params.order_type);
    const suffix = query.toString();
    return url(`/orders/history${suffix ? `?${suffix}` : ""}`);
  },
  ORDERS_MANUAL: () => url("/orders/manual"),
  ORDERS_BILLING: () => url("/orders/billing-details"),
  ORDERS_CALCULATE: (params: { amount: number; currency: string }) => {
    const query = new URLSearchParams();
    query.set("amount", String(params.amount));
    query.set("currency", params.currency);
    return url(`/orders/calculate-amount?${query.toString()}`);
  },
  WALLET: (params?: { partner_id?: string }) => {
    const query = new URLSearchParams();
    if (params?.partner_id) query.set("partner_id", params.partner_id);
    const suffix = query.toString();
    return url(`/wallet${suffix ? `?${suffix}` : ""}`);
  },
  WALLET_TRANSACTIONS: (params: {
    limit: number;
    offset: number;
    partner_id?: string;
    start_date?: number;
    end_date?: number;
    service_name?: string;
    transaction_type?: string;
  }) => {
    const query = new URLSearchParams();
    query.set("limit", String(params.limit));
    query.set("offset", String(params.offset));
    if (params.partner_id) query.set("partner_id", params.partner_id);
    if (params.start_date !== undefined) query.set("start_date", String(params.start_date));
    if (params.end_date !== undefined) query.set("end_date", String(params.end_date));
    if (params.service_name) query.set("service_name", params.service_name);
    if (params.transaction_type) query.set("transaction_type", params.transaction_type);
    return url(`/wallet/transactions?${query.toString()}`);
  },
  ORDERS_INITIATE: () => url("/orders/initiate"),
  ORDERS_VALIDATE: () => url("/orders/validate"),
  ENTITLEMENT_UPDATE_START_DATE: () => url("/entitlements/update-start-date"),
  ENTITLEMENT_DISMISS_POPUP: (serviceName: string) => {
    const query = new URLSearchParams();
    query.set("service_name", serviceName);
    return url(`/entitlements/dismiss-popup?${query.toString()}`);
  },
  GRACE_GRANT: () => url("/grace/grant"),
  GRACE_STATUS: (partnerId: string) => {
    const query = new URLSearchParams();
    query.set("partner_id", partnerId);
    return url(`/grace/status?${query.toString()}`);
  },
  PAYMENT_HISTORY: (params: { limit: number; offset: number }) => {
    const query = new URLSearchParams();
    query.set("limit", String(params.limit));
    query.set("offset", String(params.offset));
    return url(`/payment/history?${query.toString()}`);
  },
  PARTNER_META_GET: (partnerId: string) => url(`/partner_meta_data/partner/${partnerId}`),
  PARTNER_META_CREATE: (partnerId: string) => url(`/partner_meta_data/${partnerId}`),
  PARTNER_META_UPDATE: (partnerId: string) => url(`/partner_meta_data/${partnerId}`),
  API_KEY_GET: () => url("/get_api_key"),
  API_KEY_ROTATE: () => url("/generate_api_key"),
  API_KEY_UPDATE: () => url("/api_key"),
  API_KEY_INACTIVATE: () => url("/inactivate_api_key"),
  AUDIT_LOGS: (params?: {
    resource?: string;
    action?: string;
    limit?: number;
    offset?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.resource) query.set("resource", params.resource);
    if (params?.action) query.set("action", params.action);
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    if (params?.offset !== undefined) query.set("offset", String(params.offset));
    const suffix = query.toString();
    return url(`/audit-logs${suffix ? `?${suffix}` : ""}`);
  },
} as const;

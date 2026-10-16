/** Dashboard domain contracts (partner homepage + dashboard cards). */

export interface DashboardCard {
  title: string;
  key: string | null;
  count: number;
}

export interface HomepageUserInfo {
  id: string;
  name: string;
  designation?: string | null;
  email: string;
}

export interface HomepageSubscriptionStatus {
  status: string;
  entitlement_start_date: string | null;
  entitlement_end_date: string | null;
}

export interface HomepagePartnerInfo {
  partner_id: string;
  partner_name: string;
  subscription_mode?: string | null;
  subscription_status?: Record<string, HomepageSubscriptionStatus> | null;
}

export interface HomepageServicesInfo {
  is_talko_enabled: boolean;
  is_obotaai_enabled: boolean;
  is_add_number_enabled: boolean;
}

export interface HomepageDetails {
  user_info: HomepageUserInfo;
  partner_info: HomepagePartnerInfo;
  user_permissions: Record<string, boolean>;
  services_info: HomepageServicesInfo;
}

import type { HomepageData, PartnerInfo } from "@/types/api";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    /** Feature flags from the homepage payload, not RBAC slugs. */
    permissions: Record<string, boolean>;
    partnerInfo: PartnerInfo | null;
    servicesInfo: Record<string, unknown> | null;
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    /** Feature flags from the homepage payload, not RBAC slugs. */
    permissions: Record<string, boolean>;
    partnerInfo: PartnerInfo | null;
    servicesInfo: Record<string, unknown> | null;
    userInfo?: HomepageData["user_info"];
  }
}

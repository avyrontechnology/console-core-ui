import type { HomepageData, PartnerInfo } from "@/types/api";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    permissions: string[];
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
    permissions: string[];
    partnerInfo: PartnerInfo | null;
    servicesInfo: Record<string, unknown> | null;
    userInfo?: HomepageData["user_info"];
  }
}

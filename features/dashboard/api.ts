import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type { DashboardCard, HomepageDetails } from "@/types/dashboard";

/** Dashboard HTTP calls, in one place. */
export const dashboardApi = {
  cards(): Promise<DashboardCard[]> {
    return consoleApi.get<DashboardCard[]>(ENDPOINTS.DASHBOARD_CARDS());
  },

  homepage(): Promise<HomepageDetails> {
    return consoleApi.get<HomepageDetails>(ENDPOINTS.HOMEPAGE_DETAILS());
  },
};

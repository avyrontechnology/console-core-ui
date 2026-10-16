import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type { UpdateStartDateInput, UpdatedEntitlement } from "@/types/entitlement";

/** All entitlement HTTP calls, in one place. */
export const entitlementsApi = {
  updateStartDate(input: UpdateStartDateInput): Promise<UpdatedEntitlement[]> {
    return consoleApi.patch<UpdatedEntitlement[]>(ENDPOINTS.ENTITLEMENT_UPDATE_START_DATE(), input);
  },

  dismissPopup(serviceName: string): Promise<unknown> {
    return consoleApi.patch<unknown>(ENDPOINTS.ENTITLEMENT_DISMISS_POPUP(serviceName));
  },
};

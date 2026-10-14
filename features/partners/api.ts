import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type { CreatePartnerInput, Partner, UpdatePartnerInput } from "@/types/partner";

/** All partner HTTP calls, in one place. List is POST (filter body). */
export const partnersApi = {
  list(): Promise<Partner[]> {
    return consoleApi.post<Partner[]>(ENDPOINTS.PARTNERS(), {});
  },

  getById(id: string): Promise<Partner> {
    return consoleApi.get<Partner>(ENDPOINTS.PARTNER_BY_ID(id));
  },

  create(input: CreatePartnerInput): Promise<Partner> {
    return consoleApi.post<Partner>(ENDPOINTS.PARTNER_CREATE(), input);
  },

  update(id: string, input: UpdatePartnerInput): Promise<Partner> {
    return consoleApi.patch<Partner>(ENDPOINTS.PARTNER_UPDATE(id), input);
  },

  remove(id: string): Promise<void> {
    return consoleApi.delete<void>(ENDPOINTS.PARTNER_DELETE(id));
  },

  toggleActivation(id: string, isActive: boolean): Promise<Partner> {
    return consoleApi.patch<Partner>(ENDPOINTS.PARTNER_TOGGLE_ACTIVATION(id), {
      is_active: isActive,
    });
  },
};

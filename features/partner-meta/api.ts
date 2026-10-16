import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type { PartnerMeta, PartnerMetaInput } from "@/types/partner-meta";

/** All partner-meta HTTP calls, in one place. */
export const partnerMetaApi = {
  get(partnerId: string): Promise<PartnerMeta> {
    return consoleApi.get<PartnerMeta>(ENDPOINTS.PARTNER_META_GET(partnerId));
  },

  create(partnerId: string, input: PartnerMetaInput): Promise<PartnerMeta> {
    return consoleApi.post<PartnerMeta>(ENDPOINTS.PARTNER_META_CREATE(partnerId), input);
  },

  update(partnerId: string, input: PartnerMetaInput): Promise<PartnerMeta> {
    return consoleApi.patch<PartnerMeta>(ENDPOINTS.PARTNER_META_UPDATE(partnerId), input);
  },
};

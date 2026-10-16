import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type { GraceRecord, GraceStatus, GrantGraceInput } from "@/types/grace";

/** All grace HTTP calls, in one place. */
export const graceApi = {
  status(partnerId: string): Promise<GraceStatus> {
    return consoleApi.get<GraceStatus>(ENDPOINTS.GRACE_STATUS(partnerId));
  },

  grant(input: GrantGraceInput): Promise<GraceRecord> {
    return consoleApi.post<GraceRecord>(ENDPOINTS.GRACE_GRANT(), input);
  },
};

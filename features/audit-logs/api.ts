import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type { AuditLog, AuditLogFilters } from "@/types/audit-log";

/** All audit-log HTTP calls, in one place. */
export const auditLogsApi = {
  list(filters?: AuditLogFilters): Promise<AuditLog[]> {
    return consoleApi.get<AuditLog[]>(ENDPOINTS.AUDIT_LOGS(filters));
  },
};

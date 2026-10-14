import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  CreateRoleInput,
  MatrixResponse,
  Permission,
  Role,
  UpdateRoleInput,
} from "@/types/rbac";

/** All RBAC HTTP calls, in one place. */
export const rbacApi = {
  roles(): Promise<Role[]> {
    return consoleApi.get<Role[]>(ENDPOINTS.ROLES_LIST());
  },

  roleById(id: string): Promise<Role> {
    return consoleApi.get<Role>(ENDPOINTS.ROLE_BY_ID(id));
  },

  createRole(input: CreateRoleInput): Promise<Role> {
    return consoleApi.post<Role>(ENDPOINTS.ROLE_CREATE(), input);
  },

  updateRole(id: string, input: UpdateRoleInput): Promise<Role> {
    return consoleApi.patch<Role>(ENDPOINTS.ROLE_UPDATE(id), input);
  },

  deleteRole(id: string): Promise<void> {
    return consoleApi.delete<void>(ENDPOINTS.ROLE_DELETE(id));
  },

  permissions(): Promise<Permission[]> {
    return consoleApi.get<Permission[]>(ENDPOINTS.PERMISSIONS_LIST());
  },

  matrix(): Promise<MatrixResponse> {
    return consoleApi.get<MatrixResponse>(ENDPOINTS.PERMISSION_MATRIX());
  },

  setRoleActionPermissions(
    roleId: string,
    partnerId: string,
    permissions: Record<string, boolean>,
  ): Promise<unknown> {
    return consoleApi.put<unknown>(ENDPOINTS.ROLE_ACTION_PERMISSIONS(roleId), {
      partner_id: partnerId,
      permissions,
    });
  },
};

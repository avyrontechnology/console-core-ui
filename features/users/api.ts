import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  CreateUserInput,
  PaginatedUsers,
  Role,
  UpdateUserInput,
  User,
  UserListParams,
} from "@/types/user";

/** All user HTTP calls, in one place. No URL literals, no axios elsewhere. */
export const usersApi = {
  list(params?: UserListParams): Promise<PaginatedUsers> {
    return consoleApi.get<PaginatedUsers>(ENDPOINTS.USERS(params));
  },

  getById(id: string): Promise<User> {
    return consoleApi.get<User>(ENDPOINTS.USER_BY_ID(id));
  },

  create(input: CreateUserInput): Promise<User> {
    return consoleApi.post<User>(ENDPOINTS.USER_CREATE(), input);
  },

  update(id: string, input: UpdateUserInput): Promise<User> {
    return consoleApi.patch<User>(ENDPOINTS.USER_UPDATE(id), input);
  },

  remove(id: string): Promise<void> {
    return consoleApi.delete<void>(ENDPOINTS.USER_DELETE(id));
  },

  roles(): Promise<Role[]> {
    return consoleApi.get<Role[]>(ENDPOINTS.ROLES());
  },
};

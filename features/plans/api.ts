import { consoleApi } from "@/lib/console";
import { ENDPOINTS } from "@/lib/endpoints";
import type {
  CreatePlanInput,
  Plan,
  PlanListParams,
  ServiceModules,
  UpdatePlanInput,
} from "@/types/plan";

/** All plan HTTP calls, in one place. */
export const plansApi = {
  list(params?: PlanListParams): Promise<Plan[]> {
    return consoleApi.get<Plan[]>(ENDPOINTS.PLANS(params));
  },

  getById(id: string): Promise<Plan> {
    return consoleApi.get<Plan>(ENDPOINTS.PLAN_BY_ID(id));
  },

  create(input: CreatePlanInput): Promise<Plan> {
    return consoleApi.post<Plan>(ENDPOINTS.PLAN_CREATE(), input);
  },

  update(id: string, input: UpdatePlanInput): Promise<Plan> {
    return consoleApi.patch<Plan>(ENDPOINTS.PLAN_UPDATE(id), input);
  },

  remove(id: string): Promise<void> {
    return consoleApi.delete<void>(ENDPOINTS.PLAN_DELETE(id));
  },

  async modules(): Promise<ServiceModules> {
    // The endpoint wraps the map: {modules: {service: [mod, ...]}}. Returning
    // the envelope made callers iterate over the wrapper key and render it.
    const data = await consoleApi.get<{ modules?: ServiceModules }>(ENDPOINTS.PLAN_MODULES());
    return data?.modules ?? {};
  },
};

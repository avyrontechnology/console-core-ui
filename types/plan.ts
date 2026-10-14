/** Plan domain contracts (mirror of console-core plan schemas). */

export interface Plan {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  discount_percentage?: number | null;
  currency: string;
  duration: number;
  modules: string[];
  plan_type: string;
  tag?: string | null;
  hierarchy?: number | null;
  service_name?: string | null;
  is_free_trial?: boolean | null;
  otc_charge?: number | null;
  is_active: boolean;
  is_purchased?: boolean;
}

export interface PlanListParams {
  service_name?: string;
  plan_type?: string;
  duration?: number;
}

export interface CreatePlanInput {
  name: string;
  description?: string;
  price?: number;
  discount_percentage?: number;
  currency: string;
  duration: number;
  modules: string[];
  plan_type?: string;
  tag: string;
  hierarchy: number;
  service_name: string;
  is_free_trial?: boolean;
  otc_charge?: number;
}

export type UpdatePlanInput = Partial<
  Pick<
    Plan,
    | "name"
    | "description"
    | "price"
    | "discount_percentage"
    | "currency"
    | "duration"
    | "modules"
    | "plan_type"
    | "tag"
    | "hierarchy"
    | "service_name"
    | "is_free_trial"
    | "otc_charge"
    | "is_active"
  >
>;

export type ServiceModules = Record<string, string[]>;

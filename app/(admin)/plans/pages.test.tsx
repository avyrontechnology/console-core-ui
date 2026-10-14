import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NewPlanPage from "@/app/(admin)/plans/new/page";
import PlanDetailPage from "@/app/(admin)/plans/[id]/page";
import PlansPage from "@/app/(admin)/plans/page";
import ModulesPage from "@/app/(admin)/plans/modules/page";
import {
  useCreatePlan,
  useDeletePlan,
  usePlan,
  usePlanModules,
  usePlans,
} from "@/features/plans/hooks";

jest.mock("@/features/plans/hooks", () => ({
  useCreatePlan: jest.fn(),
  useDeletePlan: jest.fn(),
  usePlan: jest.fn(),
  usePlanModules: jest.fn(),
  usePlans: jest.fn(),
  useUpdatePlan: jest.fn(),
}));

jest.mock("@/components/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useParams: () => ({ id: "1" }),
}));

const plan = {
  id: "1",
  name: "Starter",
  currency: "INR",
  duration: 30,
  modules: ["dashboard"],
  plan_type: "standard",
  is_active: true,
};

describe("plan pages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("list renders rows", () => {
    (usePlans as jest.Mock).mockReturnValue({
      data: [plan],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    render(<PlansPage />);
    expect(screen.getByText("Starter")).toBeInTheDocument();
  });

  it("new submits form", async () => {
    const u = userEvent.setup();
    const create = jest.fn().mockResolvedValue({ id: "9" });
    (useCreatePlan as jest.Mock).mockReturnValue({
      create,
      isSaving: false,
      error: null,
    });
    (usePlanModules as jest.Mock).mockReturnValue({ data: {} });
    render(<NewPlanPage />);
    await u.type(screen.getByLabelText(/^name/i), "Starter");
    await u.type(screen.getByLabelText(/^tag/i), "starter");
    await u.type(screen.getByLabelText(/service name/i), "console");
    await u.type(screen.getByLabelText(/currency/i), "INR");
    await u.type(screen.getByLabelText(/duration/i), "30");
    await u.type(screen.getByLabelText(/hierarchy/i), "4");
    await u.click(screen.getByRole("button", { name: /create plan/i }));
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ name: "Starter" }));
  });

  it("detail deletes after confirm", async () => {
    const u = userEvent.setup();
    const remove = jest.fn().mockResolvedValue(undefined);
    (usePlan as jest.Mock).mockReturnValue({
      data: plan,
      isLoading: false,
      error: null,
    });
    (useDeletePlan as jest.Mock).mockReturnValue({
      remove,
      isSaving: false,
      error: null,
    });
    render(<PlanDetailPage />);
    expect(screen.getByText("Starter")).toBeInTheDocument();
    await u.click(screen.getAllByRole("button", { name: /^delete$/i })[0]);
    await u.click(screen.getAllByRole("button", { name: /^delete$/i })[1]);
    expect(remove).toHaveBeenCalledWith("1");
  });

  it("modules page groups by service", () => {
    (usePlanModules as jest.Mock).mockReturnValue({
      data: { console: ["dashboard", "analytics"] },
      isLoading: false,
      error: null,
    });
    render(<ModulesPage />);
    expect(screen.getByText("console")).toBeInTheDocument();
    expect(screen.getByText("dashboard")).toBeInTheDocument();
  });
});

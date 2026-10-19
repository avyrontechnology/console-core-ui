import { plansApi } from "@/features/plans/api";
import { consoleApi } from "@/lib/console";

jest.mock("@/lib/console", () => ({
  consoleApi: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mocked = consoleApi as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

describe("plansApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists with optional filters", async () => {
    mocked.get.mockResolvedValue([]);
    await plansApi.list({ service_name: "console", plan_type: "premium" });
    expect(mocked.get).toHaveBeenCalledWith(
      expect.stringContaining("/plans/get-plans?service_name=console&plan_type=premium"),
    );
    await plansApi.list();
    expect(mocked.get).toHaveBeenCalledWith(expect.stringMatching(/\/plans\/get-plans$/));
  });

  it("CRUDs plans by id", async () => {
    const id = "11111111-1111-1111-1111-111111111111";
    mocked.get.mockResolvedValue({});
    mocked.post.mockResolvedValue({});
    mocked.patch.mockResolvedValue({});
    mocked.delete.mockResolvedValue(undefined);
    await plansApi.getById(id);
    await plansApi.create({
      name: "P",
      currency: "INR",
      duration: 30,
      tag: "t",
      hierarchy: 4,
      service_name: "console",
      modules: [],
    });
    await plansApi.update(id, { name: "P2" });
    await plansApi.remove(id);
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining(id));
    expect(mocked.post).toHaveBeenCalledWith(
      expect.stringContaining("/plans/create-plan"),
      expect.objectContaining({ name: "P" }),
    );
    expect(mocked.patch).toHaveBeenCalledWith(expect.stringContaining(id), { name: "P2" });
    expect(mocked.delete).toHaveBeenCalledWith(expect.stringContaining(id));
  });

  it("fetches modules and unwraps the envelope", async () => {
    mocked.get.mockResolvedValue({ modules: { console: ["dashboard"] } });
    await expect(plansApi.modules()).resolves.toEqual({ console: ["dashboard"] });
    expect(mocked.get).toHaveBeenCalledWith(expect.stringContaining("/plans/get-modules"));
  });

  it("returns an empty map when the envelope is missing modules", async () => {
    mocked.get.mockResolvedValue({ modules: {} });
    await expect(plansApi.modules()).resolves.toEqual({});
  });
});

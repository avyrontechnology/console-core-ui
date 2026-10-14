import { act, renderHook, waitFor } from "@testing-library/react";

import { plansApi } from "@/features/plans/api";
import {
  useCreatePlan,
  useDeletePlan,
  usePlan,
  usePlanModules,
  usePlans,
  useUpdatePlan,
} from "@/features/plans/hooks";

jest.mock("@/features/plans/api", () => ({
  plansApi: {
    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    modules: jest.fn(),
  },
}));

const mocked = plansApi as unknown as Record<string, jest.Mock>;

describe("plans hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("usePlans loads list", async () => {
    mocked.list.mockResolvedValue([{ id: "1" }]);
    const { result } = renderHook(() => usePlans());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ id: "1" }]);
    expect(mocked.list).toHaveBeenCalledWith(undefined);
  });

  it("usePlans forwards filters", async () => {
    mocked.list.mockResolvedValue([]);
    const { result } = renderHook(() => usePlans({ service_name: "console" }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mocked.list).toHaveBeenCalledWith(expect.objectContaining({ service_name: "console" }));
  });

  it("usePlan skips null id", () => {
    const { result } = renderHook(() => usePlan(null));
    expect(result.current.data).toBeNull();
    expect(mocked.getById).not.toHaveBeenCalled();
  });

  it("mutations round-trip", async () => {
    mocked.create.mockResolvedValue({ id: "9" });
    mocked.update.mockResolvedValue({ id: "9" });
    mocked.remove.mockResolvedValue(undefined);
    const creator = renderHook(() => useCreatePlan());
    let created: unknown;
    await act(async () => {
      created = await creator.result.current.create({
        name: "P",
        currency: "INR",
        duration: 30,
        tag: "t",
        hierarchy: 4,
        service_name: "console",
        modules: [],
      });
    });
    expect(created).toEqual({ id: "9" });

    const updater = renderHook(() => useUpdatePlan());
    await act(async () => {
      await updater.result.current.update("9", { name: "P2" });
    });
    expect(mocked.update).toHaveBeenCalledWith("9", { name: "P2" });

    const remover = renderHook(() => useDeletePlan());
    await act(async () => {
      await remover.result.current.remove("9");
    });
    expect(mocked.remove).toHaveBeenCalledWith("9");
  });

  it("usePlanModules loads map", async () => {
    mocked.modules.mockResolvedValue({ console: ["a"] });
    const { result } = renderHook(() => usePlanModules());
    await waitFor(() => expect(result.current.data).toEqual({ console: ["a"] }));
  });
});

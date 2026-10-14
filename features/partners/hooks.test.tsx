import { act, renderHook, waitFor } from "@testing-library/react";

import { partnersApi } from "@/features/partners/api";
import {
  useCreatePartner,
  useDeletePartner,
  usePartner,
  usePartners,
  useTogglePartnerActivation,
  useUpdatePartner,
} from "@/features/partners/hooks";

jest.mock("@/features/partners/api", () => ({
  partnersApi: {
    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleActivation: jest.fn(),
  },
}));

const mocked = partnersApi as unknown as Record<string, jest.Mock>;

describe("partners hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("usePartners loads list", async () => {
    mocked.list.mockResolvedValue([{ id: "1" }]);
    const { result } = renderHook(() => usePartners());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ id: "1" }]);
  });

  it("usePartners surfaces errors", async () => {
    mocked.list.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => usePartners());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("boom");
  });

  it("usePartner skips null id", () => {
    const { result } = renderHook(() => usePartner(null));
    expect(result.current.data).toBeNull();
    expect(mocked.getById).not.toHaveBeenCalled();
  });

  it("mutations round-trip", async () => {
    mocked.create.mockResolvedValue({ id: "9" });
    mocked.update.mockResolvedValue({ id: "9", name: "B" });
    mocked.remove.mockResolvedValue(undefined);
    mocked.toggleActivation.mockResolvedValue({ id: "9", is_active: false });

    const creator = renderHook(() => useCreatePartner());
    let created: unknown;
    await act(async () => {
      created = await creator.result.current.create({
        name: "Acme",
        company_legal_name: "Acme Corp",
      });
    });
    expect(created).toEqual({ id: "9" });

    const updater = renderHook(() => useUpdatePartner());
    let updated: unknown;
    await act(async () => {
      updated = await updater.result.current.update("9", { name: "B" });
    });
    expect(updated).toEqual({ id: "9", name: "B" });

    const remover = renderHook(() => useDeletePartner());
    await act(async () => {
      await remover.result.current.remove("9");
    });
    expect(mocked.remove).toHaveBeenCalledWith("9");

    const toggler = renderHook(() => useTogglePartnerActivation());
    let toggled: unknown;
    await act(async () => {
      toggled = await toggler.result.current.toggle("9", false);
    });
    expect(toggled).toEqual({ id: "9", is_active: false });
  });
});

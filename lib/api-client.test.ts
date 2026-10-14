import { ApiClient, ApiError } from "@/lib/api-client";

const requestUses: Array<(config: { headers: { set: jest.Mock } }) => unknown> = [];
const responseUses: Array<{
  onOk: (response: unknown) => unknown;
  onErr: (error: unknown) => never;
}> = [];

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: {
          use: jest.fn((fn: unknown) => {
            requestUses.push(fn as never);
          }),
        },
        response: {
          use: jest.fn((onOk: unknown, onErr: unknown) => {
            responseUses.push({ onOk: onOk as never, onErr: onErr as never });
          }),
        },
      },
      get: jest.fn().mockResolvedValue({ data: { data: "g" } }),
      post: jest.fn().mockResolvedValue({ data: { data: "p" } }),
      patch: jest.fn().mockResolvedValue({ data: { data: "pa" } }),
      put: jest.fn().mockResolvedValue({ data: { data: "pu" } }),
      delete: jest.fn().mockResolvedValue({ data: { data: "d" } }),
    })),
  },
}));

describe("ApiClient", () => {
  beforeEach(() => {
    requestUses.length = 0;
    responseUses.length = 0;
  });

  it("attaches bearer token from provider", async () => {
    const headers = { set: jest.fn() };
    new ApiClient({ getToken: () => "tok" });
    await requestUses[requestUses.length - 1]({ headers });
    expect(headers.set).toHaveBeenCalledWith("Authorization", "Bearer tok");
  });

  it("skips header without token", async () => {
    const headers = { set: jest.fn() };
    new ApiClient({});
    await requestUses[requestUses.length - 1]({ headers });
    expect(headers.set).not.toHaveBeenCalled();
  });

  it("normalizes errors and fires onUnauthorized on 401", () => {
    const onUnauthorized = jest.fn();
    new ApiClient({ onUnauthorized });
    const { onErr } = responseUses[responseUses.length - 1];
    try {
      onErr({ response: { status: 401, data: { detail: "expired" } } });
      throw new Error("should have thrown");
    } catch (error) {
      expect(error).toMatchObject({ message: "expired", status: 401 });
    }
    expect(onUnauthorized).toHaveBeenCalled();
  });

  it("defaults message without payload", () => {
    new ApiClient({});
    const { onErr } = responseUses[responseUses.length - 1];
    try {
      onErr({});
      throw new Error("should have thrown");
    } catch (error) {
      expect(error).toMatchObject({ message: "Something went wrong" });
    }
  });

  it("ApiError carries status and detail", () => {
    const error = new ApiError("Nope", 403, "denied");
    expect(error.message).toBe("Nope");
    expect(error.status).toBe(403);
    expect(error.detail).toBe("denied");
  });

  it("verbs unwrap data payloads", async () => {
    const client = new ApiClient({});
    await expect(client.get<string>("/a")).resolves.toBe("g");
    await expect(client.post<string>("/a", { x: 1 })).resolves.toBe("p");
    await expect(client.patch<string>("/a", { x: 1 })).resolves.toBe("pa");
    await expect(client.put<string>("/a", { x: 1 })).resolves.toBe("pu");
    await expect(client.delete<string>("/a")).resolves.toBe("d");
  });
});

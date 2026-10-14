import { authorizeWithConsole } from "@/lib/console-auth";

describe("authorizeWithConsole", () => {
  const homepage = {
    user_info: { id: "1", email: "a@x.com", name: "A" },
    user_permissions: ["console:get_all_users"],
    partner_info: null,
    services_info: null,
  };

  it("logs in then hydrates with the fresh token", async () => {
    const client = {
      post: jest.fn().mockResolvedValue({ access_token: "tok", token_type: "b" }),
      get: jest.fn().mockResolvedValue(homepage),
    };
    const result = await authorizeWithConsole(client, "a@x.com", "secret123");
    expect(client.post).toHaveBeenCalledWith(expect.stringContaining("/do_login"), {
      credential: "a@x.com",
      password: "secret123",
    });
    expect(client.get).toHaveBeenCalledWith(expect.stringContaining("/partner_homepage_details"), {
      headers: { Authorization: "Bearer tok" },
    });
    expect(result.accessToken).toBe("tok");
    expect(result.user_permissions).toEqual(["console:get_all_users"]);
  });

  it("propagates login failure", async () => {
    const client = {
      post: jest.fn().mockRejectedValue(new Error("Nope")),
      get: jest.fn(),
    };
    await expect(authorizeWithConsole(client, "a@x.com", "x")).rejects.toThrow("Nope");
    expect(client.get).not.toHaveBeenCalled();
  });
});

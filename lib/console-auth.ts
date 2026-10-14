import { ENDPOINTS } from "./endpoints";
import type { ApiClient } from "./api-client";
import type { HomepageData, TokenPair } from "@/types/api";

type Client = Pick<ApiClient, "get" | "post">;

/** Backend login + hydrate. Single place that touches credentials. */
export async function authorizeWithConsole(
  client: Client,
  email: string,
  password: string,
): Promise<HomepageData & { accessToken: string }> {
  const token = await client.post<TokenPair>(ENDPOINTS.LOGIN(), {
    credential: email,
    password,
  });
  const homepage = await client.get<HomepageData>(ENDPOINTS.HOMEPAGE_DETAILS(), {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  return { ...homepage, accessToken: token.access_token };
}

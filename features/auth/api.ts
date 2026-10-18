import { ENDPOINTS } from "@/lib/endpoints";

/** Permission slugs granted to the caller. */
export async function fetchUserPermissions(accessToken: string): Promise<string[]> {
  const response = await fetch(ENDPOINTS.USER_PERMISSIONS(), {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Failed to load permissions (${response.status})`);
  }
  const payload = (await response.json()) as { data?: unknown };
  const data: unknown = payload?.data;
  if (Array.isArray(data)) return data.filter((s): s is string => typeof s === "string");
  // Guard against the backend ever changing the shape again.
  return [];
}

import { ENDPOINTS } from "@/lib/endpoints";

describe("ENDPOINTS", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CONSOLE_BASE_URL = "http://localhost:8000";
  });

  it("builds console-service URLs without string literals elsewhere", () => {
    expect(ENDPOINTS.LOGIN()).toBe(
      "http://localhost:8000/console-service/v1/do_login?svc_name=console",
    );
    expect(ENDPOINTS.HOMEPAGE_DETAILS()).toBe(
      "http://localhost:8000/console-service/v1/partner_homepage_details",
    );
  });
});

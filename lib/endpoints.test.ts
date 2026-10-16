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
    expect(ENDPOINTS.DASHBOARD_CARDS()).toBe(
      "http://localhost:8000/console-service/v1/partner_dashboard_cards",
    );
  });

  it("builds orders/wallet URLs", () => {
    expect(ENDPOINTS.ORDERS_HISTORY({ limit: 20, offset: 1 })).toContain("/orders/history");
    expect(ENDPOINTS.ORDERS_MANUAL()).toBe(
      "http://localhost:8000/console-service/v1/orders/manual",
    );
    expect(ENDPOINTS.ORDERS_BILLING()).toBe(
      "http://localhost:8000/console-service/v1/orders/billing-details",
    );
    expect(ENDPOINTS.WALLET()).toBe("http://localhost:8000/console-service/v1/wallet");
    expect(ENDPOINTS.WALLET_TRANSACTIONS({ limit: 20, offset: 1 })).toContain(
      "/wallet/transactions",
    );
  });

  it("builds entitlement/grace/payment URLs", () => {
    expect(ENDPOINTS.ORDERS_INITIATE()).toContain("/orders/initiate");
    expect(ENDPOINTS.ORDERS_VALIDATE()).toContain("/orders/validate");
    expect(ENDPOINTS.ENTITLEMENT_UPDATE_START_DATE()).toContain("/entitlements/update-start-date");
    expect(ENDPOINTS.GRACE_GRANT()).toContain("/grace/grant");
    expect(ENDPOINTS.GRACE_STATUS("p1")).toContain("/grace/status");
  });

  it("builds payment + partner-meta URLs", () => {
    expect(ENDPOINTS.PAYMENT_HISTORY({ limit: 20, offset: 1 })).toContain("/payment/history");
    expect(ENDPOINTS.PARTNER_META_GET("p1")).toContain("/partner_meta_data/partner/p1");
    expect(ENDPOINTS.PARTNER_META_CREATE("p1")).toContain("/partner_meta_data/p1");
  });
});

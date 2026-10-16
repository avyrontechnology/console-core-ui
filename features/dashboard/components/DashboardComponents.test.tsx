import { render, screen } from "@testing-library/react";

import { DashboardCards } from "@/features/dashboard/components/DashboardCards";
import { PartnerOverview } from "@/features/dashboard/components/PartnerOverview";
import type { HomepageDetails } from "@/types/dashboard";

const details: HomepageDetails = {
  user_info: { id: "u1", name: "Asha", designation: "Admin", email: "a@x.com" },
  partner_info: {
    partner_id: "p1",
    partner_name: "Acme",
    subscription_mode: "MANAGED",
    subscription_status: {
      console: { status: "ACTIVE", entitlement_start_date: null, entitlement_end_date: null },
    },
  },
  user_permissions: { can_view_dashboard: true },
  services_info: { is_talko_enabled: true, is_obotaai_enabled: false, is_add_number_enabled: true },
};

describe("dashboard components", () => {
  it("renders cards with counts", () => {
    render(
      <DashboardCards
        cards={[
          { title: "Total Partners", key: null, count: 10 },
          { title: "Last 7 Days Partners", key: "last7", count: 2 },
        ]}
      />,
    );
    expect(screen.getByText("Total Partners")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders empty cards state", () => {
    render(<DashboardCards cards={[]} />);
    expect(screen.getByText("No dashboard data")).toBeInTheDocument();
  });

  it("renders partner overview", () => {
    render(<PartnerOverview details={details} />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText(/Asha/)).toBeInTheDocument();
    expect(screen.getByText(/console: ACTIVE/)).toBeInTheDocument();
  });
});

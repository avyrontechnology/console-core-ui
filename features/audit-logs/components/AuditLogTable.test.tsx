import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuditLogTable } from "@/features/audit-logs/components/AuditLogTable";

const logs = [
  {
    id: "1",
    action: "DENY",
    resource: "AUTH",
    resource_id: "console:get_all_users",
    performed_by: "u1",
    resource_previous_state: null,
    resource_current_state: null,
    details: "denied",
    created_at: 1700000000000,
  },
];

describe("AuditLogTable", () => {
  it("renders rows", () => {
    render(<AuditLogTable logs={logs} />);
    expect(screen.getByText("DENY")).toBeInTheDocument();
    expect(screen.getByText("console:get_all_users")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<AuditLogTable logs={[]} />);
    expect(screen.getByText(/no audit logs/i)).toBeInTheDocument();
  });

  it("renders missing fields as dashes", async () => {
    const u = userEvent.setup();
    render(
      <AuditLogTable
        logs={[
          {
            id: "2",
            action: "CREATE",
            resource: "USER",
            resource_id: null,
            performed_by: null,
            resource_previous_state: null,
            resource_current_state: null,
            details: null,
            created_at: null,
          },
        ]}
      />,
    );
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
    await u.hover(screen.getByText("CREATE"));
  });
});

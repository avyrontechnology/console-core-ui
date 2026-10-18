import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NotificationList } from "@/features/notifications/components/NotificationList";

const notification = {
  id: "1",
  title: "Lead assigned",
  body: "A new lead was assigned to you",
  data_payload: null,
  service_type: "talko" as const,
  is_read: false,
  created_at: 1700000000000,
};

describe("NotificationList", () => {
  it("renders notifications", () => {
    render(<NotificationList notifications={[notification]} />);
    expect(screen.getByText("Lead assigned")).toBeInTheDocument();
    expect(screen.getByText("A new lead was assigned to you")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<NotificationList notifications={[]} />);
    expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
  });

  it("renders read notifications muted", async () => {
    const u = userEvent.setup();
    render(<NotificationList notifications={[{ ...notification, is_read: true }]} />);
    const title = screen.getByText("Lead assigned");
    expect(title.className).toContain("text-slate-500");
    await u.click(title);
  });
});

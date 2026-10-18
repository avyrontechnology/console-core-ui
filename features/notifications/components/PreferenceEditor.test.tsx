import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PreferenceEditor } from "@/features/notifications/components/PreferenceEditor";

const prefs = [
  { source: "talko" as const, scope: "all" as const, state: "enabled" as const },
  { source: "obotaai" as const, scope: null, state: "disabled" as const },
];

describe("PreferenceEditor", () => {
  it("renders empty state", () => {
    render(<PreferenceEditor preferences={[]} onSave={jest.fn()} isSaving={false} error={null} />);
    expect(screen.getByText(/no preferences configured/i)).toBeInTheDocument();
  });

  it("toggles a preference and saves", async () => {
    const u = userEvent.setup();
    const onSave = jest.fn().mockResolvedValue(undefined);
    render(<PreferenceEditor preferences={prefs} onSave={onSave} isSaving={false} error={null} />);
    await u.click(screen.getByRole("switch", { name: /talko all notifications/i }));
    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith([
        { source: "talko", scope: "all", state: "disabled" },
        { source: "obotaai", scope: null, state: "disabled" },
      ]),
    );
  });

  it("renders server error", () => {
    render(
      <PreferenceEditor preferences={prefs} onSave={jest.fn()} isSaving={false} error="boom" />,
    );
    expect(screen.getByText("boom")).toBeInTheDocument();
  });
});

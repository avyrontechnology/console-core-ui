import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfigFlagList } from "@/features/user-configs/components/ConfigFlagList";
import { USER_CONFIG_KEYS } from "@/types/user-config";

describe("ConfigFlagList", () => {
  it("renders every flag with its current value", () => {
    render(
      <ConfigFlagList flags={{ is_talko_enabled: true }} onToggle={jest.fn()} isSaving={false} />,
    );
    expect(screen.getAllByRole("checkbox")).toHaveLength(USER_CONFIG_KEYS.length);
    expect(screen.getByLabelText("Is Talko Enabled")).toBeChecked();
    expect(screen.getByLabelText("Enable Dialer")).not.toBeChecked();
  });

  it("reports toggles", async () => {
    const u = userEvent.setup();
    const onToggle = jest.fn();
    render(<ConfigFlagList flags={{}} onToggle={onToggle} isSaving={false} />);
    await u.click(screen.getByLabelText("Can View Contact"));
    expect(onToggle).toHaveBeenCalledWith("can_view_contact", true);
  });

  it("disables inputs while saving", () => {
    render(<ConfigFlagList flags={{}} onToggle={jest.fn()} isSaving />);
    expect(screen.getAllByRole("checkbox")[0]).toBeDisabled();
  });
});

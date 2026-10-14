import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfirmDialog, Modal } from "@/components/ui/Modal";

describe("Modal", () => {
  it("closes on backdrop click and escape", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal title="T" onClose={onClose}>
        <p>body</p>
      </Modal>,
    );
    expect(screen.getByText("body")).toBeInTheDocument();
    await user.click(screen.getByRole("presentation"));
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("ConfirmDialog confirms and cancels", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    render(
      <ConfirmDialog title="Sure?" message="really?" onConfirm={onConfirm} onClose={onClose} />,
    );
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

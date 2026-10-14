import { render, screen } from "@testing-library/react";

import SessionLoader from "@/components/SessionLoader";
import { usePermissions } from "@/hooks/usePermissions";
import { setSharedToken } from "@/lib/console";

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: { id: "1", email: "a@x.com", name: "A" },
      accessToken: "tok",
      permissions: ["console:x"],
      partnerInfo: null,
      servicesInfo: null,
    },
    status: "authenticated",
  }),
}));

jest.mock("@/lib/console", () => ({
  setSharedToken: jest.fn(),
}));

function Probe() {
  const { isAuthenticated, hasPermission } = usePermissions();
  return (
    <p>
      {isAuthenticated ? "yes" : "no"}:{hasPermission("console:x") ? "1" : "0"}
    </p>
  );
}

describe("session wiring", () => {
  it("SessionLoader bridges token into shared client", () => {
    render(
      <SessionLoader>
        <Probe />
      </SessionLoader>,
    );
    expect(setSharedToken).toHaveBeenCalledWith("tok");
    expect(screen.getByText("yes:1")).toBeInTheDocument();
  });
});

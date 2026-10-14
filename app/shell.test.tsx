import { render, screen } from "@testing-library/react";

import RootLayout from "@/app/layout";
import Home from "@/app/page";
import StoreProvider from "@/app/StoreProvider";

jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

describe("app shell", () => {
  it("root layout renders children", () => {
    render(
      <RootLayout>
        <p>hello</p>
      </RootLayout>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("home renders product name", () => {
    render(<Home />);
    expect(screen.getByText("Console Core")).toBeInTheDocument();
  });

  it("store provider supplies redux store", () => {
    render(
      <StoreProvider>
        <p>inside</p>
      </StoreProvider>,
    );
    expect(screen.getByText("inside")).toBeInTheDocument();
  });
});

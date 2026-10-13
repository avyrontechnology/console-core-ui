import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import SessionLoader from "@/components/SessionLoader";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "Console Core",
  description: "Console Core admin UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <StoreProvider>
            <SessionLoader>{children}</SessionLoader>
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import SessionLoader from "@/components/SessionLoader";
import StoreProvider from "./StoreProvider";
import { Outfit, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const spaceGroteskHeading = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Console Core",
  description: "Console Core admin UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", outfit.variable, spaceGroteskHeading.variable)}>
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

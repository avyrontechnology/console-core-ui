"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { setSharedToken } from "@/lib/console";

/** Bridges the NextAuth session into the shared API client. Mount once. */
export default function SessionLoader({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    setSharedToken(session?.accessToken ?? null);
  }, [session?.accessToken]);

  return <>{children}</>;
}

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login"];

/** Unauthenticated users go to /login; authenticated users skip it. */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (
    req.auth ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", req.url));
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

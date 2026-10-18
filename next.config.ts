import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  outputFileTracingRoot: __dirname,
  // `next build` writes the same directory as `next dev` by default, so a
  // build run against a live dev server corrupts its RSC manifest and the
  // browser dies with "Cannot read properties of undefined (reading 'call')".
  // Build with NEXT_DIST_DIR=.next-build to keep the two apart.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;

import type { NextConfig } from "next";

// Never framed, no plugins, no foreign <base> or form targets.
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  // Every screen reads the login cookie and shows live numbers, so pages are
  // rendered per request (the prokolpo model) rather than with Cache Components.
  cacheComponents: false,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Business numbers: never kept by a shared browser or proxy cache.
      { source: "/((?!_next/static|icon|apple-icon|manifest).*)", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import { getRedirects } from "./lib/getRedirects";

import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
      style-src 'self' 'unsafe-inline' https:;
      img-src 'self' data: blob: https:;
      font-src 'self' https: data:;
      connect-src 'self' https: wss:;
      media-src 'self' blob: https:;
      frame-src 'self' https:;
      frame-ancestors 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `
      .replace(/\s{2,}/g, " ")
      .trim(),
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const projectId = "vj7fkgq8";

const nextConfig: NextConfig = {
  transpilePackages: ["quirk-ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: `/images/${projectId}/production/**`,
      },
    ],
  },
  async redirects() {
    const sanityRedirects = await getRedirects();
    return [...sanityRedirects];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);

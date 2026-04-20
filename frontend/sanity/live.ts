/**
 * sanity/live.ts
 *
 * Exports SanityLive for use in the DraftModeTools client component only.
 * This file is intentionally separate from sanity/fetch.ts so that
 * server components importing sanityFetch never pull in the live
 * editing runtime.
 *
 * Only import from this file inside "use client" components that are
 * themselves dynamically imported (e.g. DraftModeTools.tsx).
 */

import { createClient, defineLive } from "next-sanity";
import { sanityConfig } from "./config";

const client = createClient({
  ...sanityConfig,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
});

export const { SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
});

/**
 * sanity/fetch.ts
 *
 * Server-only data fetching. Import sanityFetch from here in Server Components
 * and API routes — this file does NOT import SanityLive so it never drags
 * the live editing runtime into the client bundle.
 */

import { createClient, defineLive } from "next-sanity";
import { sanityConfig } from "./config";

export const client = createClient({
  ...sanityConfig,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
});

export const { sanityFetch } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
});

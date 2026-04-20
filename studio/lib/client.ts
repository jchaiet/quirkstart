import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: false,
  token: process.env.SANITY_STUDIO_API_READ_WRITE_TOKEN,
});

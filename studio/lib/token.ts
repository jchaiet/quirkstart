export const token = process.env.SANITY_STUDIO_API_READ_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_STUDIO_API_READ_TOKEN");
}

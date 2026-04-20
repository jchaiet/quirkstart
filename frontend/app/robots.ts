import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === "production";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // Block all crawlers until the site is live.
  // Change disallow to allow and uncomment sitemap when ready.
  return isProd
    ? {
        rules: { userAgent: "*", disallow: "/" },
        sitemap: `${baseUrl}/sitemap.xml`,
      }
    : {
        rules: { userAgent: "*", disallow: "/" },
      };
}

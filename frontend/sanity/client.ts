import { createClient } from "next-sanity";
import { sanityConfig } from "./config";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { Link } from "quirk-ui/sanity";
import { navigationQuery, siteSettingsQuery } from "./queries";
import { siteQuery } from "./queries/site";

export const sanityClient = createClient(sanityConfig);
export const writeSanityClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_API_READ_WRITE_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export async function fetchSites() {
  const sites = await sanityClient.fetch(
    `*[_type == "site"]{"id": identifier.current, domain}`,
  );

  const mapping: Record<string, string> = {};

  for (const site of sites) {
    try {
      const hostname = new URL(site.domain).hostname;
      mapping[hostname] = site.id;
    } catch {
      console.warn(`Invalid domain for site ${site.id}: ${site.domain}`);
    }
  }

  return mapping;
}

export async function fetchSiteSettings(siteId: string) {
  if (siteId) {
    const site = await sanityClient.fetch(siteQuery, { siteId });

    if (!site) {
      console.warn(
        `No site document found for domain "${siteId}". Using default fallback`,
      );
      return {
        title: "Default Site",
        description: "Default description",
        defaultSEO: {},
        siteIcon: {},
        socialLinks: [],
      };
    }

    return site;
  }

  return await sanityClient.fetch(siteSettingsQuery);
}

export async function fetchNavigation(slug = "main-navigation") {
  return sanityClient.fetch(navigationQuery, { slug });
}

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

export async function resolveLinkURL(cta: Link) {
  if (cta.type !== "link") return undefined;

  const options = cta.linkOptions;

  if (options?.linkType === "external" && options.externalUrl) {
    return options.externalUrl;
  }

  if (options?.linkType === "internal" && options.internalUrl?.slug) {
    return `/${options.internalUrl?.slug.current}`;
  }

  return "#";
}

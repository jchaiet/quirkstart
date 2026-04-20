/**
 * lib/pageHelpers.ts
 *
 * Shared utilities for page.tsx files across the boilerplate.
 * Centralises logic that was previously copy-pasted across the blog,
 * docs, and main page files.
 */

import { cache } from "react";
import type { Metadata } from "next";
import {
  fetchSiteSettings,
  fetchNavigation,
  urlForImage,
} from "@/sanity/client";
import { mapNavigation } from "./mapNavigation";
import { mapUtilityItems } from "./mapUtilityItems";
import { mapSocialLinks } from "./mapSocialLinks";
import { mapGroups } from "./mapGroups";

// ─── Cached fetches ────────────────────────────────────────────────────────────
// React cache() deduplicates calls within the same request — so
// generateMetadata and the page function can both call these without
// triggering double fetches.

export const getCachedSiteSettings = cache(
  async (site: string) => await fetchSiteSettings(site),
);

export const getCachedNavigation = cache(
  async (slug: string) => await fetchNavigation(slug),
);

// ─── PageMeta type ────────────────────────────────────────────────────────────
// Shape of the pageMetadata object from Sanity after GROQ projection.

export type PageMeta = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string[];
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: { asset?: { url?: string } };
  twitterCard?: "summary" | "summary_large_image";
};

// ─── generatePageMetadata ──────────────────────────────────────────────────────
// Shared metadata generator used by all page files.
// pageMeta (from page.metadata in Sanity) overrides site-level defaults
// where provided — page always wins, site is the fallback.

export async function generatePageMetadata(
  site: string,
  pageMeta?: PageMeta,
): Promise<Metadata> {
  const settings = await getCachedSiteSettings(site);

  const faviconUrl = settings?.siteIcon?.favicon
    ? urlForImage(settings.siteIcon.favicon)
        .width(32)
        .height(32)
        .quality(100)
        .url()
    : "/favicon.ico";

  // OG image — page overrides site default
  const ogImageUrl = pageMeta?.ogImage?.asset?.url
    ? pageMeta.ogImage.asset.url
    : settings?.defaultSEO?.image
      ? urlForImage(settings.defaultSEO.image)
          .width(1200)
          .height(630)
          .quality(90)
          .url()
      : "/og-image.png";

  const siteName = settings?.title || "My Site";

  // Resolved values — page wins, site is fallback
  const title =
    pageMeta?.title ||
    settings?.defaultSEO?.title ||
    settings?.title ||
    "My Site";

  const description =
    pageMeta?.description ||
    settings?.defaultSEO?.description ||
    settings?.description;

  const keywords = pageMeta?.keywords?.length
    ? pageMeta.keywords
    : settings?.defaultSEO?.keywords || ["website"];

  // Robots — parse pageMetadata "index, follow" string format
  const robotsString = pageMeta?.robots || settings?.defaultSEO?.robots || "";
  const robots = {
    index: !robotsString.includes("noindex"),
    follow: !robotsString.includes("nofollow"),
  };

  const canonical = pageMeta?.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL;

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    ),
    title,
    description,
    keywords,
    robots,
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
    },
    icons: {
      icon: [faviconUrl && { url: faviconUrl, sizes: "32x32" }].filter(
        Boolean,
      ) as { url: string; sizes?: string }[],
      apple: settings?.siteIcon?.appleTouchIcon
        ? urlForImage(settings.siteIcon.appleTouchIcon).quality(100).url()
        : undefined,
      other: settings?.siteIcon?.maskIcon
        ? [
            {
              rel: "mask-icon",
              url: urlForImage(settings.siteIcon.maskIcon).quality(100).url(),
            },
          ]
        : [],
    },
    openGraph: {
      type: "website",
      siteName,
      title: pageMeta?.ogTitle || title,
      description: pageMeta?.ogDescription || description,
      url: process.env.NEXT_PUBLIC_SITE_URL,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pageMeta?.ogTitle || title,
        },
      ],
    },
    twitter: {
      card: pageMeta?.twitterCard || "summary_large_image",
      site: settings?.social?.twitterHandle || "@yoursite",
      title: pageMeta?.ogTitle || title,
      description: pageMeta?.ogDescription || description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical,
      languages: {
        "en-us": `${process.env.NEXT_PUBLIC_SITE_URL}/`,
        "es-us": `${process.env.NEXT_PUBLIC_SITE_URL}/es-us`,
      },
    },
  };
}

// ─── fetchNavigationData ───────────────────────────────────────────────────────
// Fetches and maps all navigation data needed for a page.
// Previously duplicated across all three page files.

export async function fetchNavigationData(opts: {
  site: string;
  navigationSlug: string;
  footerSlug: string;
  blogNav?: boolean;
  sidebarSlug?: string;
}) {
  const settings = await getCachedSiteSettings(opts.site);

  const [
    navigationData,
    footerNavigationData,
    blogNavigationData,
    sidebarData,
  ] = await Promise.all([
    getCachedNavigation(opts.navigationSlug),
    getCachedNavigation(opts.footerSlug),
    opts.blogNav
      ? getCachedNavigation("blog-navigation")
      : Promise.resolve(null),
    opts.sidebarSlug
      ? getCachedNavigation(opts.sidebarSlug)
      : Promise.resolve(null),
  ]);

  const [navItems, navGroups, utilityItems] = await Promise.all([
    navigationData?.navigationItems
      ? mapNavigation(navigationData.navigationItems)
      : Promise.resolve([]),
    navigationData?.navigationGroups
      ? mapGroups(navigationData.navigationGroups)
      : Promise.resolve([]),
    navigationData?.utilityItems
      ? mapUtilityItems(navigationData.utilityItems)
      : Promise.resolve([]),
  ]);

  const [footerNavItems, footerUtilityItems] = await Promise.all([
    footerNavigationData?.navigationItems
      ? mapNavigation(footerNavigationData.navigationItems)
      : Promise.resolve([]),
    footerNavigationData?.utilityItems
      ? mapUtilityItems(footerNavigationData.utilityItems)
      : Promise.resolve([]),
  ]);

  const footerSocialItems = settings?.socialLinks
    ? await mapSocialLinks(settings.socialLinks)
    : [];

  const blogNavItems = blogNavigationData?.navigationItems?.length
    ? await mapNavigation(blogNavigationData.navigationItems)
    : [];

  const sidebarNavItems = sidebarData?.navigationItems?.length
    ? await mapNavigation(sidebarData.navigationItems)
    : [];

  return {
    settings,
    navigationData,
    navItems,
    navGroups,
    utilityItems,
    footerNavigationData,
    footerNavItems,
    footerUtilityItems,
    footerSocialItems,
    blogNavItems,
    sidebarNavItems,
  };
}

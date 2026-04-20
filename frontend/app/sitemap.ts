import type { MetadataRoute } from "next";
import groq from "groq";
import { sanityClient } from "@/sanity/client";
import { defaultLocale } from "@/lib/i18n";

type SitemapPage = {
  slug: string;
  locale: string;
  _updatedAt: string;
};

const query = groq`{
  "pages": *[
    _type == "page" &&
    defined(slug.current) &&
    !(_id in path("drafts.**"))
  ]{
    _updatedAt,
    locale,
    "slug": slug.current
  },
  "articles": *[
    _type == "blog" &&
    defined(slug.current) &&
    !(_id in path("drafts.**"))
  ]{
    _updatedAt,
    locale,
    "slug": slug.current
  },
  "docs": *[
    _type == "docs" &&
    defined(slug.current) &&
    !(_id in path("drafts.**"))
  ]{
    _updatedAt,
    locale,
    "slug": slug.current
  }
}`;

function buildUrl(baseUrl: string, path: string, locale: string): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const slug = path === "home" ? "" : path;
  return `${baseUrl}${prefix}/${slug}`.replace(/\/$/, "") || baseUrl;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const data = await sanityClient.fetch(query);

  const pageEntries = (data.pages as SitemapPage[]).map((page) => ({
    url: buildUrl(baseUrl, page.slug, page.locale ?? defaultLocale),
    lastModified: page._updatedAt,
    changeFrequency: "weekly" as const,
    priority: page.slug === "home" ? 1 : 0.9,
  }));

  const articleEntries = (data.articles as SitemapPage[]).map((article) => {
    const prefix = article.locale === defaultLocale ? "" : `/${article.locale}`;
    return {
      url: `${baseUrl}${prefix}/blog/articles/${article.slug}`,
      lastModified: article._updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  const docEntries = (data.docs as SitemapPage[]).map((doc) => {
    const prefix = doc.locale === defaultLocale ? "" : `/${doc.locale}`;
    return {
      url: `${baseUrl}${prefix}/docs/${doc.slug}`,
      lastModified: doc._updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  return [...pageEntries, ...articleEntries, ...docEntries].sort(
    (a, b) => b.priority - a.priority,
  );
}

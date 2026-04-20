/**
 * WebPageJsonLd.tsx
 *
 * Renders WebPage (or subtype) schema for every page.
 * Place in <head> via layout or page-level head export.
 *
 * @type mapping:
 *   default page → WebPage
 *   blog article → BlogPosting (handled by ArticleJsonLd instead)
 *   docs page    → TechArticle
 */

import { JsonLd } from "./JsonLd";

type WebPageJsonLdProps = {
  type?: "WebPage" | "TechArticle" | "AboutPage" | "ContactPage" | "FAQPage";
  title: string;
  description?: string;
  url: string;
  siteName: string;
  dateModified?: string;
};

export function WebPageJsonLd({
  type = "WebPage",
  title,
  description,
  url,
  siteName,
  dateModified,
}: WebPageJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    url,
    ...(description && { description }),
    ...(dateModified && { dateModified }),
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: url.split("/").slice(0, 3).join("/"), // strip path → base URL
    },
  };

  return <JsonLd data={data} />;
}

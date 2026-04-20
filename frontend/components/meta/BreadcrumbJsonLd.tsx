/**
 * BreadcrumbJsonLd.tsx
 *
 * Renders BreadcrumbList schema.
 * Used in docs pages to show hierarchy in search results.
 * Can also be used on any page with a clear parent/child structure.
 *
 * Enables:
 *  - Breadcrumb trail in Google search results
 *  - Better understanding of site hierarchy
 */

import { JsonLd } from "./JsonLd";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbJsonLdProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  if (!items.length) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * OrganizationJsonLd.tsx
 *
 * Renders Organization schema for the site.
 * Placed in the main page.tsx where site settings are already fetched.
 *
 * Enables:
 *  - Google Knowledge Panel
 *  - Social profile links in search results
 *  - Site name in breadcrumbs
 */

import { JsonLd } from "./JsonLd";

type OrganizationJsonLdProps = {
  siteName: string;
  siteUrl: string;
  logoUrl?: string;
  socialLinks?: string[];
  description?: string;
};

export function OrganizationJsonLd({
  siteName,
  siteUrl,
  logoUrl,
  socialLinks,
  description,
}: OrganizationJsonLdProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    ...(description && { description }),
    ...(logoUrl && {
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    }),
    ...(socialLinks?.length && { sameAs: socialLinks }),
  };

  return <JsonLd data={data} />;
}

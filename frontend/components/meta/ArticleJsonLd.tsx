/**
 * ArticleJsonLd.tsx
 *
 * Renders Article (or BlogPosting / VideoObject) schema for blog articles.
 * Placed in blog/articles/[...slug]/page.tsx.
 *
 * Enables:
 *  - Rich results in Google (headline, image, date, author)
 *  - Article carousels in Google Discover
 *  - Recipe/Video rich results when articleType matches
 */

import { JsonLd } from "./JsonLd";

type ArticleJsonLdProps = {
  title: string;
  slug: string;
  excerpt?: string;
  publishDate?: string;
  updatedAt?: string;
  imageUrl?: string;
  authorName?: string;
  siteName: string;
  siteUrl: string;
  articleType?: "article" | "recipe" | "video";
};

const schemaTypeMap: Record<string, string> = {
  article: "BlogPosting",
  recipe: "Recipe",
  video: "VideoObject",
};

export function ArticleJsonLd({
  title,
  slug,
  excerpt,
  publishDate,
  updatedAt,
  imageUrl,
  authorName,
  siteName,
  siteUrl,
  articleType = "article",
}: ArticleJsonLdProps) {
  const schemaType = schemaTypeMap[articleType] ?? "BlogPosting";
  const articleUrl = `${siteUrl}/blog/articles/${slug}`;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: title,
    url: articleUrl,
    ...(excerpt && { description: excerpt }),
    ...(publishDate && { datePublished: publishDate }),
    ...(updatedAt && { dateModified: updatedAt }),
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    }),
    author: {
      "@type": "Organization",
      name: authorName ?? siteName,
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      ...(imageUrl && {
        logo: {
          "@type": "ImageObject",
          url: imageUrl,
        },
      }),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    isPartOf: {
      "@type": "Blog",
      name: `${siteName} Blog`,
      url: `${siteUrl}/blog`,
    },
  };

  return <JsonLd data={data} />;
}

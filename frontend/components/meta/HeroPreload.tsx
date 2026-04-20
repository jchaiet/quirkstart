/**
 * components/HeroPreload.tsx
 *
 * Server component that renders a <link rel="preload"> for the hero image
 * directly in <head>. This tells the browser to start fetching the image
 * immediately during HTML parsing — before React hydrates, before JS runs,
 * before the image element even exists in the DOM.
 *
 * This is the single most impactful LCP fix for image-heavy heroes.
 *
 * Usage in your page.tsx:
 *
 *   import { HeroPreload } from "@/components/HeroPreload";
 *
 *   export default async function Page() {
 *     const page = await fetchPage();
 *     const heroSection = page.sections?.find(s => s._type === "heroBlock");
 *     const heroImageUrl = heroSection?.image?.imageUrls?.default?.large;
 *
 *     return (
 *       <>
 *         <HeroPreload imageUrl={heroImageUrl} />
 *         <PageTemplate ... />
 *       </>
 *     );
 *   }
 *
 * Next.js hoists <link> tags rendered anywhere in the tree into <head>
 * automatically, so you don't need to place this inside a layout.
 */

export function HeroPreload({ imageUrl }: { imageUrl?: string }) {
  if (!imageUrl) return null;

  return (
    <link
      rel="preload"
      as="image"
      href={imageUrl}
      // imageSrcSet and imageSizes can be added if you use responsive images
      fetchPriority="high"
    />
  );
}

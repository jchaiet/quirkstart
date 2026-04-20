import type { Metadata } from "next";
import { cache } from "react";
import PageTemplate from "@/components/templates/PageTemplate";
import { PageBuilder } from "@/lib/pageBuilder";
import { sanityClient } from "@/sanity/client";
import { pageBySlugQuery } from "@/sanity/queries";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { resolveSections } from "@/lib/resolveSections";
import { resolveAnnouncement } from "@/lib/resolveAnnouncement";
import { HeroPreload } from "@/components/meta/HeroPreload";
import { WebPageJsonLd } from "@/components/meta/WebPageJsonLd";
import { generatePageMetadata, fetchNavigationData } from "@/lib/pageHelpers";

interface PageProps {
  params: Promise<{ site: string; slug: string[]; locale: string }>;
  searchParams?: Promise<{ categories: string | string[] }>;
}

// Cache page fetch so generateMetadata and Page don't double-fetch
const getPage = cache(
  async (
    slug: string[] | null,
    locale: string,
    isDraft: boolean,
    site: string,
  ) => {
    const formattedSlug = slug?.length ? slug.join("/") : "home";
    const fetchOpts = isDraft
      ? { perspective: "drafts" as const, useCdn: false, stega: true }
      : undefined;

    return sanityClient.fetch(
      pageBySlugQuery,
      { slug: formattedSlug, locale, site },
      fetchOpts,
    );
  },
);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { site, slug, locale } = await params;
  const { isEnabled } = await draftMode();
  // Reuse the cached getPage — no extra network call
  const page = await getPage(slug, locale, isEnabled, site);
  return generatePageMetadata(site, page?.metadata);
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug, locale, site } = await params;
  const { isEnabled } = await draftMode();

  const resolvedParams = await searchParams;
  let categoryOverride: string[] | undefined;
  if (resolvedParams?.categories) {
    categoryOverride = Array.isArray(resolvedParams.categories)
      ? resolvedParams.categories
      : [resolvedParams.categories];
  }

  let page = await getPage(slug, locale, isEnabled, site);
  if (!page && locale !== "en-us") {
    page = await getPage(slug, "en-us", isEnabled, site);
  }
  if (!page) notFound();

  const {
    pageBuilder = [],
    hideHeader = false,
    hideFooter = false,
    navigationOverride,
    footerOverride,
    site: siteRef,
  } = page;

  const isBlog = page?.slug?.current?.startsWith("blog");

  // Run sections resolution and navigation fetching in parallel
  const [resolvedSections, nav] = await Promise.all([
    resolveSections(pageBuilder ?? [], {
      locale,
      site,
      isDraft: isEnabled,
      categoryOverride,
    }),
    fetchNavigationData({
      site,
      navigationSlug:
        navigationOverride?.slug ??
        siteRef?.defaultNavigation?.slug ??
        "main-navigation",
      footerSlug:
        footerOverride?.slug ?? siteRef?.defaultFooter?.slug ?? "main-footer",
      blogNav: isBlog,
    }),
  ]);

  const announcement = resolveAnnouncement(page);

  const heroSection = resolvedSections?.find(
    (s: { _type: string }) => s._type === "heroBlock",
  ) as { image?: { imageUrls?: { default?: { large?: string } } } } | undefined;
  const heroImageUrl = heroSection?.image?.imageUrls?.default?.large;

  return (
    <>
      <HeroPreload imageUrl={heroImageUrl} />
      <WebPageJsonLd
        title={page.metadata?.title || page.title}
        description={page.metadata?.description}
        url={`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/${page.slug?.current === "home" ? "" : (page.slug?.current ?? "")}`}
        siteName={nav.settings?.title ?? ""}
        dateModified={page._updatedAt}
      />
      <PageTemplate
        isBlog={isBlog}
        hideHeader={hideHeader}
        hideFooter={hideFooter}
        siteSettings={nav.settings}
        navigationData={nav.navigationData}
        navItems={nav.navItems}
        navGroups={nav.navGroups}
        utilityItems={nav.utilityItems}
        footerNavigationData={nav.footerNavigationData}
        footerNavItems={nav.footerNavItems}
        footerUtilityItems={nav.footerUtilityItems}
        footerSocialItems={nav.footerSocialItems}
        blogNavItems={nav.blogNavItems}
        announcement={announcement}
      >
        <PageBuilder sections={resolvedSections} pageData={page} />
      </PageTemplate>
    </>
  );
}

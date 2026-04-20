import React from "react";
import { sanityClient } from "@/sanity/client";
import { articleBySlugQuery } from "@/sanity/queries";
import PageTemplate from "@/components/templates/PageTemplate";
import { PageBuilder } from "@/lib/pageBuilder";
import { resolveSections } from "@/lib/resolveSections";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { type SanityCategory, type PageSection } from "quirk-ui/sanity";
import { generatePageMetadata, fetchNavigationData } from "@/lib/pageHelpers";
import { ArticleJsonLd } from "@/components/meta/ArticleJsonLd";
import { pageMetadataFragment } from "@/sanity/queries/fragments";
import { resolveAnnouncement } from "@/lib/resolveAnnouncement";

interface PageProps {
  params: Promise<{ site: string; slug: string[]; locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { site, slug, locale } = await params;
  const formattedSlug = slug.join("/");
  const pageMeta = await sanityClient.fetch(
    `*[_type == "blog" && slug.current == $slug && locale == $locale][0].metadata{ ${pageMetadataFragment} }`,
    { slug: formattedSlug, locale },
  );
  return generatePageMetadata(site, pageMeta);
}

export default async function Page({ params }: PageProps) {
  const { slug, locale, site } = await params;
  const { isEnabled } = await draftMode();

  const formattedSlug = slug.join("/") ?? "/";
  const fetchOpts = isEnabled
    ? { perspective: "drafts" as const, useCdn: false, stega: true }
    : undefined;

  let page = await sanityClient.fetch(
    articleBySlugQuery,
    { slug: formattedSlug, locale, site },
    fetchOpts,
  );

  if (!page && locale !== "en-us") {
    page = await sanityClient.fetch(
      articleBySlugQuery,
      { slug: formattedSlug, locale: "en-us", site },
      fetchOpts,
    );
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

  const resolvedSections = await resolveSections(pageBuilder ?? [], {
    locale,
    site,
    isDraft: isEnabled,
  });

  const type = page?._type === "blog" ? "article" : "other";
  const hasKeywordsCategory = page.categories?.some((cat: SanityCategory) =>
    cat.slug?.current?.includes("/keywords"),
  );

  const sectionsWithStaticComponents = resolvedSections.flatMap(
    (section: PageSection) => {
      if (section._type === "featuredDocumentsBlock") {
        const newSections: PageSection[] = [];
        if (hasKeywordsCategory) {
          newSections.push({
            _type: "additionalCategoriesBlock",
            categories: page.categories ?? [],
            type,
          });
        }
        newSections.push({ _type: "wasHelpfulBlock", page, type });
        newSections.push(section);
        return newSections;
      }
      return [section];
    },
  );

  const announcement = resolveAnnouncement(page);

  const nav = await fetchNavigationData({
    site,
    navigationSlug:
      navigationOverride?.slug ??
      siteRef?.defaultNavigation?.slug ??
      "main-navigation",
    footerSlug:
      footerOverride?.slug ?? siteRef?.defaultFooter?.slug ?? "main-footer",
    blogNav: true,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return (
    <>
      <ArticleJsonLd
        title={page.title}
        slug={page.slug?.current ?? ""}
        excerpt={page.excerpt}
        publishDate={page.publishDate}
        updatedAt={page._updatedAt}
        imageUrl={page.featuredImage?.asset?.url}
        siteName={nav.settings?.title ?? ""}
        siteUrl={siteUrl}
        articleType={page.articleType}
      />
      <PageTemplate
        isBlog={true}
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
        <PageBuilder sections={sectionsWithStaticComponents} pageData={page} />
      </PageTemplate>
    </>
  );
}

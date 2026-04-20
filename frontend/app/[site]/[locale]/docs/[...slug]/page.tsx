import React from "react";
import { sanityClient } from "@/sanity/client";
import { docBySlugQuery } from "@/sanity/queries";
import PageTemplate from "@/components/templates/PageTemplate";
import { PageBuilder } from "@/lib/pageBuilder";
import { resolveSections } from "@/lib/resolveSections";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { type PageSection } from "quirk-ui/sanity";
import { generatePageMetadata, fetchNavigationData } from "@/lib/pageHelpers";
import {
  BreadcrumbJsonLd,
  type BreadcrumbItem,
} from "@/components/meta/BreadcrumbJsonLd";
import { WebPageJsonLd } from "@/components/meta/WebPageJsonLd";
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
    `*[_type == "docs" && slug.current == $slug && locale == $locale][0].metadata{ ${pageMetadataFragment} }`,
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
    docBySlugQuery,
    { slug: formattedSlug, locale, site },
    fetchOpts,
  );

  if (!page && locale !== "en-us") {
    page = await sanityClient.fetch(
      docBySlugQuery,
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
    sidebar,
    site: siteRef,
  } = page;

  const resolvedSections = await resolveSections(pageBuilder ?? [], {
    locale,
    site,
    isDraft: isEnabled,
  });

  const type = page?._type;

  const sectionsWithStaticComponents = resolvedSections.flatMap(
    (section: PageSection) => {
      if (section._type === "featuredDocumentsBlock") {
        return [{ _type: "wasHelpfulBlock", page, type }, section];
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
    sidebarSlug: sidebar?.slug,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const slugSegments = formattedSlug.split("/");

  // Build breadcrumbs from slug segments
  // e.g. "getting-started/installation" → Home > Getting Started > Installation
  const breadcrumbs: BreadcrumbItem[] = [
    { name: nav.settings?.title ?? "Home", url: siteUrl },
    { name: "Docs", url: `${siteUrl}/docs` },
    ...slugSegments.map((segment, index) => ({
      name: segment
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      url: `${siteUrl}/docs/${slugSegments.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <WebPageJsonLd
        type="TechArticle"
        title={page.metadata?.title || page.title}
        description={page.metadata?.description}
        url={`${siteUrl}/docs/${formattedSlug}`}
        siteName={nav.settings?.title ?? ""}
        dateModified={page._updatedAt}
      />
      <PageTemplate
        isBlog={false}
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
        sidebarNavItems={nav.sidebarNavItems}
        announcement={announcement}
      >
        <PageBuilder sections={sectionsWithStaticComponents} pageData={page} />
      </PageTemplate>
    </>
  );
}

// Server component — no hooks, no browser APIs, pure composition
import { ReactNode } from "react";
import Layout from "@/components/layout/Layout";
import BlogHeader from "../layout/BlogHeader";
import { type NavGroup, type NavItem, type UtilityItem } from "quirk-ui/core";
import { type SiteSettings, type NavigationData } from "quirk-ui/sanity";
import { resolveImagesDeep } from "@/lib/resolveSections";
import { AnnouncementData } from "@/lib/resolveAnnouncement";

type PageTemplateProps = {
  children: ReactNode;
  layoutType?: "default" | "minimal" | "dashboard";
  hideHeader?: boolean;
  hideFooter?: boolean;
  isBlog?: boolean;
  siteSettings?: SiteSettings;
  navigationData?: NavigationData;
  navItems?: NavItem[];
  navGroups?: NavGroup[];
  utilityItems?: UtilityItem[];
  footerNavigationData?: NavigationData;
  footerNavItems?: NavItem[];
  footerUtilityItems?: UtilityItem[];
  footerSocialItems?: NavItem[];
  blogNavItems?: NavItem[];
  sidebarNavItems?: NavItem[];
  announcement?: AnnouncementData;
};

export default function PageTemplate({
  children,
  layoutType = "default",
  hideHeader = false,
  hideFooter = false,
  isBlog = false,
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
  announcement,
}: PageTemplateProps) {
  if (layoutType === "minimal") {
    return <div>{children}</div>;
  }

  const logoObj = resolveImagesDeep(navigationData?.logo);
  return (
    <Layout
      variant={navigationData?.variant ?? "standard"}
      navigationType={navigationData?.navigationType ?? "default"}
      navItems={navItems}
      utilityItems={utilityItems ?? []}
      navGroups={navGroups}
      alignment={navigationData?.alignment ?? "left"}
      logo={logoObj}
      logoLinkSlug={navigationData?.logoLink?.slug.current}
      hideHeader={hideHeader}
      hideFooter={hideFooter}
      footerNavItems={footerNavItems ?? []}
      footerUtilityItems={footerUtilityItems ?? []}
      footerSocialItems={footerSocialItems ?? []}
      footerLogo={footerNavigationData?.logo}
      footerlogoLinkSlug={footerNavigationData?.logoLink?.slug.current}
      footerAlignment={footerNavigationData?.alignment}
      footerPrimaryInfo={footerNavigationData?.primaryInfo}
      footerSecondaryInfo={footerNavigationData?.secondaryInfo}
      isSticky={navigationData?.isSticky}
      showLocaleSelect={navigationData?.showLocaleSelect}
      showSearch={navigationData?.showSearch}
      showThemeToggle={navigationData?.showThemeToggle}
      sidebarNavItems={sidebarNavItems}
      announcement={announcement}
    >
      {isBlog && blogNavItems && (
        <BlogHeader
          title="Blog"
          navItems={blogNavItems}
          alignment="right"
          transparentNav={navigationData?.variant === "transparent"}
        />
      )}
      {children}
    </Layout>
  );
}

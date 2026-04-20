"use client";
import { ReactNode } from "react";
import {
  Sidebar,
  type NavGroup,
  type NavItem,
  type UtilityItem,
} from "quirk-ui/core";
import { useTheme } from "quirk-ui/next";
import { type SanityImage } from "quirk-ui/sanity";
import Header from "./Header";
import { AnnouncementBar } from "./AnnouncementBar";
import type { AnnouncementData } from "@/lib/resolveAnnouncement";
import Footer from "./Footer";
import type { PortableTextBlock } from "@portabletext/types";
import styles from "./styles.module.css";
import { SkipToContent } from "../ui/SkipToContent";

type LayoutProps = {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  isSticky?: boolean;
  showSearch?: boolean;
  showLocaleSelect?: boolean;
  showThemeToggle?: boolean;
  navItems?: NavItem[];
  navGroups?: NavGroup[];
  alignment: "left" | "center" | "right";
  utilityItems: UtilityItem[];
  logo?: SanityImage;
  logoLinkSlug?: string;
  variant: "standard" | "transparent";
  navigationType: "default" | "advanced";
  primaryInfo?: string;
  secondaryInfo?: string;
  footerNavItems: NavItem[];
  footerUtilityItems: UtilityItem[];
  footerLogo?: SanityImage;
  footerlogoLinkSlug?: string;
  footerAlignment?: "left" | "center" | "right";
  footerPrimaryInfo?: PortableTextBlock[];
  footerSecondaryInfo?: PortableTextBlock[];
  footerSocialItems?: NavItem[];
  sidebarNavItems?: NavItem[];
  announcement?: AnnouncementData;
};

export default function Layout({
  children,
  hideHeader,
  hideFooter,
  isSticky,
  showSearch,
  showLocaleSelect,
  showThemeToggle,
  navItems,
  navGroups,
  alignment,
  utilityItems,
  logo,
  logoLinkSlug,
  variant,
  navigationType,
  footerNavItems,
  footerUtilityItems,
  footerLogo,
  footerlogoLinkSlug,
  footerAlignment,
  footerPrimaryInfo,
  footerSecondaryInfo,
  footerSocialItems,
  sidebarNavItems,
  announcement,
}: LayoutProps) {
  const { mode, mounted } = useTheme();

  const hasSidebar = sidebarNavItems && sidebarNavItems.length > 0;

  let activeImageUrl: string | undefined;
  if (logo?.imageUrls) {
    // Use mounted guard — before mount, mode is always "light" (SSR default).
    // Reading the real mode before mount causes a logo URL mismatch between
    // server HTML and client hydration. After mount, the correct theme is known.
    const resolvedMode = mounted ? mode : "light";
    activeImageUrl =
      resolvedMode === "dark"
        ? logo.imageUrls.dark?.medium || logo.imageUrls.default.medium
        : logo.imageUrls.default.medium;

    // largeImageUrl =
    //   mode === "dark"
    //     ? logo.imageUrls.dark?.large || logo.imageUrls.default.large
    //     : logo.imageUrls.default.large;
  }

  return (
    <>
      <SkipToContent />
      <AnnouncementBar
        announcement={announcement ?? null}
        isSticky={isSticky}
      />
      {!hideHeader && (
        <Header
          utilityItems={utilityItems ?? []}
          navItems={navItems ?? []}
          navGroups={navGroups ?? []}
          alignment={alignment}
          logoUrl={activeImageUrl ?? ""}
          logoAlt={logo?.asset?.altText ?? "Company logo"}
          logoLinkSlug={logoLinkSlug}
          variant={variant}
          navigationType={navigationType}
          isSticky={isSticky}
          showSearch={showSearch}
          showLocaleSelect={showLocaleSelect}
          showThemeToggle={showThemeToggle}
        />
      )}
      <main
        id="main-content"
        className={[
          variant === "transparent" ? styles.transparent : "",
          isSticky && variant === "standard" ? styles.stickyOffset : "",
          isSticky && variant === "transparent" ? styles.transparentSticky : "",
          hasSidebar ? styles.hasSidebar : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {hasSidebar && <Sidebar items={sidebarNavItems} alignment="left" />}
        <div className={styles.content}>{children}</div>
      </main>
      {!hideFooter && (
        <Footer
          variant="default"
          navItems={footerNavItems}
          utilityItems={footerUtilityItems}
          alignment={footerAlignment}
          logoUrl={activeImageUrl ?? ""}
          logoAlt={footerLogo?.asset?.altText}
          logoLinkSlug={footerlogoLinkSlug}
          socialItems={footerSocialItems}
          primaryInfo={footerPrimaryInfo}
          secondaryInfo={footerSecondaryInfo}
        />
      )}
    </>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SearchModal } from "../ui/SearchModal";
import { LocaleModal } from "../ui/LocaleModal";
import { ThemeToggle } from "../ui/ThemeToggle";
import { RichText } from "quirk-ui/next";
import {
  Navbar,
  type UtilityItem,
  type NavItem,
  type NavGroup,
} from "quirk-ui/core";
import { RichContent } from "quirk-ui";
import { useLocaleBridge } from "quirk-ui/next";
import { usePathname } from "next/navigation";
import { locales, getLocaleLink } from "@/lib/i18n";

// ─── Module-level sub-components ──────────────────────────────────────────────

function LogoLink({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type HeaderProps = {
  navItems: NavItem[];
  navGroups: NavGroup[];
  utilityItems: UtilityItem[];
  alignment: "left" | "center" | "right";
  logoUrl: string | null;
  logoAlt: string;
  logoLinkSlug?: string;
  variant: "standard" | "transparent";
  navigationType: "default" | "advanced";
  isSticky?: boolean;
  showSearch?: boolean;
  showLocaleSelect?: boolean;
  showThemeToggle?: boolean;
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Header({
  variant,
  navigationType = "default",
  navItems,
  navGroups,
  utilityItems,
  alignment,
  logoUrl,
  logoAlt,
  logoLinkSlug,
  isSticky,
  showSearch,
  showLocaleSelect,
  showThemeToggle,
}: HeaderProps) {
  const [localeLinks, setLocaleLinks] = useState<Record<string, string>>({});
  const { locale: currentLocale } = useLocaleBridge();
  const currentPath = usePathname();

  // Build locale links whenever path or locale changes
  useEffect(() => {
    if (!currentPath) return;

    async function buildLinks() {
      const result: Record<string, string> = {};
      for (const locale of locales) {
        result[locale.id] = await getLocaleLink(
          currentPath,
          locale.id,
          currentLocale,
        );
      }
      setLocaleLinks(result);
    }

    buildLinks();
  }, [currentPath, currentLocale]); // ← added missing currentLocale dep

  // Stable renderText — won't cause Navbar re-renders
  const renderText = useCallback(
    (content?: RichContent, className?: string) => {
      if (!content) return null;
      if (typeof content === "string") return content;
      if (typeof content === "object") {
        if (content.type === "markdown") return content.content;
        if (content.type === "portableText") {
          return <RichText className={className} blocks={content.content} />;
        }
      }
      return null;
    },
    [],
  );

  if (!navItems || !Array.isArray(navItems)) return null;

  const logoHref = logoLinkSlug === "home" ? "/" : `/${logoLinkSlug}`;

  const LogoImage = logoUrl ? (
    <Image
      src={logoUrl}
      alt={logoAlt || "Logo"}
      width={200}
      height={73}
      sizes="150px"
      priority
      style={{ width: "auto", height: "var(--logo-height, 40px)" }}
    />
  ) : null;

  const logo = LogoImage ? (
    logoLinkSlug ? (
      <LogoLink href={logoHref} ariaLabel={logoAlt}>
        {LogoImage}
      </LogoLink>
    ) : (
      LogoImage
    )
  ) : null;

  return (
    <Navbar
      renderText={renderText}
      searchComponent={<SearchModal />}
      showSearch={showSearch}
      showLocaleSelect={showLocaleSelect}
      localeSelectComponent={<LocaleModal links={localeLinks} />}
      showThemeToggle={showThemeToggle}
      themeToggleComponent={<ThemeToggle />}
      isSticky={isSticky}
      variant={variant}
      navigationType={navigationType}
      alignment={alignment}
      items={navItems ?? []}
      groups={navGroups ?? []}
      utilityItems={utilityItems ?? []}
      logo={logo}
    />
  );
}

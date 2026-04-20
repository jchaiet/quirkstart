import {
  Footer as FooterNav,
  type NavItem,
  type UtilityItem,
} from "quirk-ui/core";
import { RichText } from "quirk-ui/next";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";

export type FooterProps = {
  navItems: NavItem[];
  utilityItems?: UtilityItem[];
  alignment?: "left" | "center" | "right";
  logoUrl?: string | null;
  logoAlt?: string;
  logoLinkSlug?: string;
  variant: "default" | "minimal";
  socialItems?: NavItem[];
  primaryInfo?: PortableTextBlock[];
  secondaryInfo?: PortableTextBlock[];
};

// ─── Module-level sub-components ──────────────────────────────────────────────
// Defined outside Footer so React never creates new component types on re-render

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

export default function Footer({
  navItems,
  utilityItems,
  logoUrl,
  logoAlt,
  logoLinkSlug,
  socialItems,
  primaryInfo,
  secondaryInfo,
}: FooterProps) {
  if (!navItems || !Array.isArray(navItems)) return null;

  const logoHref = logoLinkSlug === "home" ? "/" : `/${logoLinkSlug}`;

  const LogoImage = logoUrl ? (
    <Image
      src={logoUrl}
      alt={logoAlt || "Logo"}
      width={150}
      height={50}
      sizes="150px"
      priority
      style={{ width: "150px", height: "auto" }}
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

  // Build enhanced utility items with next/image for image-type items
  const enhancedUtilityItems: UtilityItem[] | undefined = utilityItems?.map(
    (item) => {
      if (item.imageSrc) {
        return {
          ...item,
          label: (
            <Image
              src={item.imageSrc}
              alt={item.imageAlt || item.ariaLabel || "Item image"}
              width={175}
              height={59}
            />
          ),
          displayType: "image" as const,
        };
      }
      return item;
    },
  );

  return (
    <FooterNav
      logo={logo}
      items={navItems}
      primaryInfo={primaryInfo ? <RichText blocks={primaryInfo} /> : null}
      secondaryInfo={secondaryInfo ? <RichText blocks={secondaryInfo} /> : null}
      socialItems={socialItems}
      utilityItems={enhancedUtilityItems}
      copyright="&copy; 2025"
    />
  );
}

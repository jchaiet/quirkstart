import type { UtilityItem } from "quirk-ui/core";
import type { Link } from "quirk-ui/sanity";

/**
 * Maps Sanity link data to UtilityItem props for the Navbar/Footer.
 *
 * Note: ImageComponent intentionally omitted — Footer and Header
 * construct their own <Image> elements from imageSrc + imageAlt,
 * so building a JSX element here was redundant and caused it to be
 * discarded and rebuilt downstream.
 */
export async function mapUtilityItems(links: Link[]): Promise<UtilityItem[]> {
  return links.map((link) => {
    const linkOptions = link.linkOptions;

    let href = "#";
    if (
      linkOptions?.linkType === "internal" &&
      linkOptions.internalUrl?.slug?.current
    ) {
      href = `/${linkOptions.internalUrl.slug.current}`;
    } else if (
      linkOptions?.linkType === "external" &&
      linkOptions?.externalUrl
    ) {
      href = linkOptions.externalUrl;
    }

    return {
      _key: link._key,
      label: link.label,
      ariaLabel: link.ariaLabel,
      href,
      variant: link.variant,
      displayType: link.displayType,
      imageSrc: link.image?.asset?.url,
      imageAlt: link.image?.asset?.altText || link.ariaLabel || link.label,
      icon: link.icon,
      iconAlignment: link.iconAlignment,
    };
  });
}

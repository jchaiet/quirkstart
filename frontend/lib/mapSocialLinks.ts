import { SocialLink } from "@/types";
import type { NavItem } from "quirk-ui/core";

export async function mapSocialLinks(
  socialLinks: SocialLink[]
): Promise<NavItem[]> {
  return socialLinks.map((link) => {
    return {
      _key: link._key,
      label: link.platform,
      isExternal: true,
      href: link.url,
      icon: link.platform,
    };
  });
}

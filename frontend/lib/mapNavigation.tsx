import type { NavItem } from "quirk-ui/core";
import { NavigationItem } from "@/types";
import { resolveNavItemHref } from "./resolveNavItemHref";
import { localizeHref } from "./localizeHref";

export async function mapNavigation(
  items: NavigationItem[]
): Promise<NavItem[]> {
  const navItems = await Promise.all(
    items.map(async (item) => {
      const label = item.title;
      const key = item._key;
      const description = { type: "portableText", content: item.description };
      const subtitle = item.subtitle;

      if (
        (item.itemType === "list" || item.itemType === "dropdown") &&
        item.children?.length
      ) {
        const subLinks = await Promise.all(
          item.children.map(async (child) => {
            const href = await resolveNavItemHref(child);
            const finalHref =
              child.itemType === "external" ? href : localizeHref(href);

            if (!href) return null;
            return {
              _key: child._key,
              label: child.title,
              href: finalHref,
              isExternal: child.itemType === "external",
            };
          })
        );

        const validSubLinks = subLinks.filter(Boolean) as {
          _key: string;
          label: string;
          href: string;
        }[];

        return {
          _key: key,
          label,
          subtitle,
          description,
          sublinks: validSubLinks,
        };
      }

      const href = await resolveNavItemHref(item);
      const finalHref =
        item.itemType === "external" ? href : localizeHref(href);
      if (href) {
        return {
          _key: key,
          label,
          href: finalHref,
          isExternal: item.itemType === "external",
        };
      }

      return null;
    })
  );

  return navItems.filter(Boolean) as NavItem[];
}

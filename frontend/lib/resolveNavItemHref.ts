import type { NavigationItem } from "@/types";

export async function resolveNavItemHref(
  item: NavigationItem
): Promise<string> {
  if (item.itemType === "external" && item.externalUrl) {
    return item.externalUrl;
  }

  if (item.itemType === "internal" && item.internalUrl?.slug?.current) {
    const slug = item.internalUrl.slug.current;
    const docType = item.internalUrl._type;

    let prefix = "";
    switch (docType) {
      case "docs":
        prefix = "/docs";
        break;
      case "blog":
        prefix = "/blog/articles";
        break;
      case "page":
        prefix = "";
        break;
      default:
        prefix = "";
    }

    if (item.internalUrl?.slug?.current) {
      return `${prefix}/${slug}`;
    }
  }

  return "#";
}

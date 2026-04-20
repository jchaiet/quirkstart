import type { NavigationItem } from "@/types";
import type { NavGroup } from "quirk-ui/core";
import type { SanitySpotlight } from "quirk-ui/sanity";
import { mapNavigation } from "./mapNavigation";
import { urlForImage } from "@/sanity/client";

export async function mapGroups(
  groups: {
    _key: string;
    title: string;
    primaryItems: NavigationItem[];
    secondaryItems: NavigationItem[];
    spotlight: SanitySpotlight;
  }[],
): Promise<NavGroup[]> {
  return await Promise.all(
    groups.map(async (group) => {
      const primaryItems = await mapNavigation(group.primaryItems);
      const secondaryItems = group.secondaryItems
        ? await mapNavigation(group.secondaryItems)
        : undefined;

      const spotlight: SanitySpotlight = {
        ...group.spotlight,
        title: group.spotlight.title
          ? {
              type: "portableText",
              content: Array.isArray(group.spotlight.title)
                ? group.spotlight.title
                : [group.spotlight.title],
            }
          : undefined,
        description: group.spotlight.description
          ? {
              type: "portableText",
              content: Array.isArray(group.spotlight.description)
                ? group.spotlight.description
                : [group.spotlight.description],
            }
          : undefined,
        image: group.spotlight.image
          ? {
              ...group.spotlight.image,
              imageUrls: {
                default: {
                  small: urlForImage(group.spotlight?.image.defaultImage)
                    .width(300)
                    .quality(90)
                    .url(),
                  medium: urlForImage(group.spotlight?.image.defaultImage)
                    .width(600)
                    .quality(90)
                    .url(),
                  large: urlForImage(group.spotlight?.image.defaultImage)
                    .width(800)
                    .quality(90)
                    .url(),
                },
                dark: {
                  small: urlForImage(group.spotlight?.image.darkImage)
                    .width(300)
                    .quality(90)
                    .url(),
                  medium: urlForImage(group.spotlight?.image.darkImage)
                    .width(600)
                    .quality(90)
                    .url(),
                  large: urlForImage(group.spotlight?.image.darkImage)
                    .width(800)
                    .quality(90)
                    .url(),
                },
              },
            }
          : undefined,
      };

      return {
        _key: group._key,
        title: group.title,
        primaryItems,
        secondaryItems,
        spotlight,
      };
    }),
  );
}

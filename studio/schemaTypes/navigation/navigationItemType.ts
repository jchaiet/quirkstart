import { defineType, defineField } from "sanity";
import { LinkIcon, HomeIcon, EarthGlobeIcon } from "@sanity/icons";

interface NavigationItemValidationContext {
  itemType?: "internal" | "external" | "dropdown" | "list";
}

export const navigationItemType = defineType({
  name: "navigationItem",
  title: "Navigation Item",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Text displayed for the navigation item",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "richText",
    }),
    defineField({
      name: "itemType",
      title: "Item Type",
      type: "string",
      options: {
        list: [
          { title: "Internal Link", value: "internal" },
          { title: "External Link", value: "external" },
          { title: "Dropdown", value: "dropdown" },
          { title: "List", value: "list" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "internalUrl",
      title: "Internal Page",
      description: "Select an internal page to link to",
      type: "reference",
      to: [{ type: "page" }],
      hidden: ({ parent }) =>
        (parent as NavigationItemValidationContext)?.itemType !== "internal",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as NavigationItemValidationContext;
          if (parent?.itemType === "internal" && !value) {
            return "Internal page is required for internal links";
          }
          return true;
        }),
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      description: "Full URL for an external website",
      type: "url",
      hidden: ({ parent }) =>
        (parent as NavigationItemValidationContext)?.itemType !== "external",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as NavigationItemValidationContext;
          if (parent?.itemType === "external" && !value) {
            return "External URL is required for external links";
          }
          return true;
        }),
    }),
    defineField({
      name: "children",
      title: "Child Items",
      description: "Items that appear in the dropdown or list",
      type: "array",
      of: [{ type: "navigationItem" }],
      hidden: ({ parent }) =>
        (parent as NavigationItemValidationContext)?.itemType !== "dropdown" &&
        (parent as NavigationItemValidationContext)?.itemType !== "list",
    }),
  ],
  preview: {
    select: {
      title: "title",
      itemType: "itemType",
      internalTitle: "internalUrl.title",
      internalSlug: "internalUrl.slug.current",
      externalUrl: "externalUrl",
      children: "children",
    },
    prepare({
      title,
      itemType,
      internalTitle,
      internalSlug,
      externalUrl,
      children,
    }) {
      let subtitle = itemType;
      let icon = LinkIcon;

      switch (itemType) {
        case "internal":
          subtitle = internalTitle
            ? `Internal: ${internalTitle} (${internalSlug || "no slug"})`
            : "Internal (no page selected";
          icon = HomeIcon;
          break;
        case "external":
          subtitle = `External: ${externalUrl || "no URL"} `;
          icon = EarthGlobeIcon;
          break;
        case "dropdown":
          subtitle = `Dropdown (${children?.length || "0"} item${children?.length > 1 || children?.length === 0 ? "s" : ""})`;
          icon = LinkIcon;
          break;
      }
      return {
        title: title || "Untitled Nav Item",
        subtitle: subtitle,
        media: icon,
      };
    },
  },
});

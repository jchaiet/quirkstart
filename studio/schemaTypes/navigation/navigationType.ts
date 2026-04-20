import { defineType, defineField } from "sanity";
import { MenuIcon } from "@sanity/icons";

export const navigationType = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "title",
      title: "Menu Title",
      description:
        'Used to identify the menu. e.g., "Main Menu", "Footer Menu"',
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Identifier",
      description:
        'A unique identifier for this menu (e.g., "main-menu", "footer-menu")',
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().error("A unique identifier is required for the menu"),
    }),
    defineField({
      name: "navigationType",
      title: "Navigation Type",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Advanced", value: "advanced" },
          { title: "Sidebar", value: "sidebar" },
        ],
        layout: "radio",
      },
      initialValue: "default",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "Transparent", value: "transparent" },
        ],
        layout: "radio",
      },
      initialValue: "default",
      validation: (Rule) => Rule.required(),
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
    defineField({
      name: "isSticky",
      type: "boolean",
      title: "Sticky Navigation",
      description:
        "Keep the navigation fixed at the top of the page when scrolling.",
      initialValue: true,
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
    defineField({
      name: "showThemeToggle",
      type: "boolean",
      title: "Show Theme Toggle",
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
    defineField({
      name: "showSearch",
      type: "boolean",
      title: "Show Search Button",
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
    defineField({
      name: "showLocaleSelect",
      type: "boolean",
      title: "Show Locale Select",
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
    defineField({
      name: "navigationItems",
      title: "Navigation Items",
      type: "array",
      of: [{ type: "navigationItem" }],
      hidden: ({ parent }) => parent?.navigationType == "advanced",
    }),
    defineField({
      name: "navigationGroups",
      title: "Navigation Groups",
      type: "array",
      of: [{ type: "navigationGroup" }],
      hidden: ({ parent }) => parent?.navigationType !== "advanced",
    }),
    defineField({
      name: "alignment",
      title: "Primary Nav Alignment",
      type: "string",
      options: {
        list: [
          {
            title: "Left",
            value: "left",
          },
          {
            title: "Center",
            value: "center",
          },
          {
            title: "Right",
            value: "right",
          },
        ],
        layout: "radio",
      },
      initialValue: "left",
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
    defineField({
      name: "utilityItems",
      title: "Utility Items",
      description: 'Additional CTAs. e.g., "Sign in", "Sign up"',
      type: "array",
      of: [{ type: "link" }],
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "imageWithLayout",
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
    defineField({
      name: "logoLink",
      title: "Logo Link",
      description: "Page the logo should link to",
      type: "reference",
      to: [{ type: "page" }],
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
    defineField({
      name: "primaryInfo",
      type: "richText",
      title: "Primary Info",
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
    defineField({
      name: "secondaryInfo",
      type: "richText",
      title: "Secondary Info",
      hidden: ({ parent }) => parent?.navigationType == "sidebar",
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title: title || "Untitled Navigation Menu",
        subtitle: `ID: ${slug || "N/A"}`,
        media: MenuIcon,
      };
    },
  },
});

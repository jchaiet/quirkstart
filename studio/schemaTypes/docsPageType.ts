import { defineArrayMember, defineField, defineType } from "sanity";
import {
  DocumentsIcon,
  InlineElementIcon,
  InlineIcon,
  HelpCircleIcon,
  DoubleChevronDownIcon,
  BlockContentIcon,
  DocumentSheetIcon,
} from "@sanity/icons";
import { isUniqueByLocale } from "../lib/isUniqueByLocale";
import { HierarchicalSlugInput } from "../components/HierarchicalSlugInput";

export const docsPageType = defineType({
  name: "docs",
  title: "Docs Page",
  type: "document",
  icon: DocumentsIcon,
  groups: [
    { name: "details", title: "Details" },
    { name: "metadata", title: "Metadata" },
    { name: "content", title: "Content" },
  ],
  fields: [
    defineField({
      name: "site",
      title: "Site",
      type: "reference",
      to: [{ type: "site" }],
      group: "details",
      readOnly: true,
      description: "This page belongs to the selected site",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locale",
      type: "string",
      group: "details",
      description: "Language for the document",
      readOnly: true,
      initialValue: "en-us",
    }),
    defineField({
      name: "title",
      title: "Page Name",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "parent",
      title: "Parent Page",
      type: "reference",
      group: "details",
      to: [
        {
          type: "page",
        },
        {
          type: "docs",
        },
      ],
      options: {
        disableNew: true,
      },
      validation: (Rule) =>
        Rule.custom((parentRef, context) => {
          if (parentRef?._ref === context?.document?._id) {
            return "A page cannot be its own parent";
          }
          return true;
        }),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "Used for the page URL",
      type: "slug",
      group: "details",
      components: {
        input: HierarchicalSlugInput,
      },
      options: {
        isUnique: isUniqueByLocale,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sidebar",
      title: "Sidebar Navigation",
      type: "reference",
      to: [{ type: "navigation" }],
      group: "details",
    }),
    defineField({
      name: "navigationOverride",
      title: "Navigation Override",
      type: "reference",
      to: [{ type: "navigation" }],
      group: "details",
      description:
        "Optional: Use a different navigation menu for this page instead of the site's default.",
    }),
    defineField({
      name: "footerOverride",
      title: "Footer Override",
      type: "reference",
      to: [{ type: "navigation" }],
      group: "details",
      description:
        "Optional: Use a different footer menu for this page instead of the site's default.",
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "pageMetadata",
      group: "metadata",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "children",
      title: "Children",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      hidden: true,
    }),
    defineField({
      name: "announcement",
      title: "Announcement",
      type: "announcement",
      group: "details",
    }),
    defineField({
      name: "pageBuilder",
      type: "array",
      title: "Page Content",
      group: "content",
      of: [
        defineArrayMember({
          type: "heroBlock",
          name: "heroBlock",
          title: "Hero",
          icon: InlineIcon,
        }),
        defineArrayMember({
          type: "carouselBlock",
          name: "carouselBlock",
          title: "Carousel",
          icon: InlineElementIcon,
        }),
        defineArrayMember({
          type: "contentBlock",
          name: "contentBlock",
          title: "Content Block",
          icon: InlineIcon,
        }),
        defineArrayMember({
          type: "richTextBlock",
          name: "richTextBlock",
          title: "RichText Block",
          icon: BlockContentIcon,
        }),
        defineArrayMember({
          type: "markdownBlock",
          name: "markdownBlock",
          title: "Markdown Block",
          icon: BlockContentIcon,
        }),
        defineArrayMember({
          type: "tabsBlock",
          name: "tabsBlock",
          title: "Tabs Block",
          icon: InlineElementIcon,
        }),
        defineArrayMember({
          type: "accordionBlock",
          name: "accordionBlock",
          title: "Accordion Block",
          icon: DoubleChevronDownIcon,
        }),
      ],
    }),
  ],
});

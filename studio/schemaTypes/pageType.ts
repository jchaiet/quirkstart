import { defineArrayMember, defineField, defineType } from "sanity";
import {
  DocumentsIcon,
  InlineElementIcon,
  InlineIcon,
  HelpCircleIcon,
  ThLargeIcon,
  DoubleChevronDownIcon,
  ListIcon,
  StarIcon,
  BlockquoteIcon,
  BlockContentIcon,
  DocumentSheetIcon,
} from "@sanity/icons";
import { isUniqueByLocale } from "../lib/isUniqueByLocale";
import { HierarchicalSlugInput } from "../components/HierarchicalSlugInput";
import { FormInputIcon } from "lucide-react";

export const pageType = defineType({
  name: "page",
  title: "Page",
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
          type: "cardGridBlock",
          name: "cardGridBlock",
          title: "Card Grid",
          icon: ThLargeIcon,
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
          type: "documentListBlock",
          name: "documentListBlock",
          title: "Document List Block",
          icon: ListIcon,
        }),
        defineArrayMember({
          type: "featuredDocumentsBlock",
          name: "featuredDocumentsBlock",
          title: "Featured Documents Block",
          icon: StarIcon,
        }),
        defineArrayMember({
          type: "stickyScrollBlock",
          name: "stickyScrollBlock",
          title: "Sticky Scroll Block",
          icon: InlineElementIcon,
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
        defineArrayMember({
          type: "quoteBlock",
          name: "quoteBlock",
          title: "Quote Block",
          icon: BlockquoteIcon,
        }),
        defineArrayMember({
          type: "formBlock",
          name: "formBlock",
          title: "Form Block",
          icon: FormInputIcon,
        }),
      ],
    }),
  ],
});

import { defineType, defineField } from "sanity";
import { StarIcon } from "@sanity/icons";
import { layoutOptionType } from "../styles/layoutOptionType";
import { paddingOptionType } from "../styles/paddingOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import IncludeFiltersWithDefaults from "../../components/IncludeFiltersWithDefaults";
import { idField } from "../fields/idField";

export const featuredDocumentsBlockType = defineType({
  name: "featuredDocumentsBlock",
  title: "Featured Documents Block",
  type: "object",
  icon: StarIcon,
  groups: [
    { name: "heading", title: "Heading" },
    { name: "content", title: "Content" },
    { name: "settings", title: "Settings" },
    { name: "callToAction", title: "Call To Action" },
  ],
  fields: [
    idField,
    defineField({
      name: "heading",
      type: "heading",
      title: "Heading",
      group: "heading",
    }),
    defineField({
      name: "selectionMode",
      title: "Selection Mode",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "Manual", value: "manual" },
          { title: "Dynamic", value: "dynamic" },
        ],
        layout: "radio",
      },
      initialValue: "manual",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "manualArticles",
      title: "Manually Selected Articles",
      type: "array",
      group: "settings",
      of: [{ type: "reference", to: [{ type: "page" }, { type: "blog" }] }],
      hidden: ({ parent }) => parent?.selectionMode === "dynamic",
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "documentType",
      title: "Document Type",
      type: "string",
      description: "Select which type of documents to show",
      group: "settings",
      options: {
        list: [
          { title: "Blog", value: "blog" },
          { title: "News", value: "news" },
          { title: "Resource", value: "resource" },
        ],
      },
      initialValue: "blog",
      hidden: ({ parent }) => parent?.selectionMode === "manual",
    }),
    defineField({
      name: "limit",
      title: "Maximum number of articles",
      group: "settings",
      type: "number",
      description: "Optional: Limit the number of articles shown (25 max)",
      hidden: ({ parent }) => parent?.selectionMode === "manual",
      validation: (Rule) => Rule.min(1).max(25),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      description: "Layout for 3 or more items.",
      group: "settings",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Featured Left", value: "featuredLeft" },
          { title: "Featured Top", value: "featuredTop" },
          { title: "Two Column", value: "twoColumn" },
          { title: "Carousel", value: "carousel" },
        ],
        layout: "radio",
      },
      initialValue: "default",
      hidden: ({ parent }) => {
        const limit = parent?.limit || 4;
        const manualLength = parent?.manualArticles?.length || 0;
        return limit <= 2 && manualLength <= 2;
      },
    }),
    defineField({
      name: "includeFilters",
      title: "Include Filters",
      description:
        "Only documents assigned to the selected categories will be fetched on the server.",
      group: "settings",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      hidden: ({ parent }) => parent?.selectionMode === "manual",
    }),
    defineField({
      name: "excludeFilters",
      title: "Exclude Filters",
      description:
        "Documents assigned to the selected categories will NOT be fetched on the server.",
      group: "settings",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      hidden: ({ parent }) => parent?.selectionMode === "manual",
    }),
    defineField({
      name: "filterMode",
      title: "Filter Mode",
      group: "settings",
      type: "string",
      options: {
        list: [
          { title: "Match Any", value: "any" },
          { title: "Match All", value: "all" },
        ],
        layout: "radio",
      },
      initialValue: "any",
      hidden: ({ parent }) => parent?.selectionMode === "manual",
    }),
    defineField({
      name: "sortBy",
      title: "Sort By",
      group: "settings",
      type: "string",
      options: {
        list: [
          { title: "Newest", value: "newest" },
          { title: "Title A-Z", value: "title" },
          { title: "Most Popular", value: "popular" },
        ],
        layout: "dropdown",
      },
      initialValue: "newest",
    }),
    defineField({
      name: "callToAction",
      title: "Call to Action",
      type: "object",
      group: "callToAction",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
        }),
        defineField({
          name: "ariaLabel",
          title: "ARIA Label",
          type: "string",
          hidden: ({ parent }) => parent?.type === "none",
        }),
        defineField({
          name: "linkOptions",
          title: "Link Options",
          type: "object",
          fields: [
            defineField({
              name: "linkType",
              title: "Link Type",
              type: "string",
              options: {
                list: [
                  { title: "Internal Page", value: "internal" },
                  { title: "External Page", value: "external" },
                ],
                layout: "radio",
              },
              initialValue: "internal",
            }),
            defineField({
              name: "internalUrl",
              title: "Internal Page",
              type: "reference",
              to: [{ type: "page" }],
              hidden: ({ parent }) => parent?.linkType !== "internal",
            }),
            defineField({
              name: "externalUrl",
              title: "External URL",
              type: "url",
              hidden: ({ parent }) => parent?.linkType !== "external",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "styleOptions",
      title: "Style Options",
      type: "object",
      options: {
        collapsible: true,
        collapsed: false,
      },
      groups: [
        { name: "padding", title: "Padding" },
        { name: "layout", title: "Layout" },
        { name: "background", title: "Background" },
      ],
      fields: [
        ...paddingOptionType,
        ...layoutOptionType,
        ...backgroundOptionType,
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Featured Documents Block",
      };
    },
  },
});

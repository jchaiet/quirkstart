import { defineType, defineField } from "sanity";
import { ThLargeIcon } from "@sanity/icons";
import { layoutOptionSimple } from "../styles/layoutOptionType";
import { paddingOptionType } from "../styles/paddingOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { idField } from "../fields/idField";

export const documentBlockType = defineType({
  name: "documentListBlock",
  type: "object",
  title: "Document List Block",
  icon: ThLargeIcon,
  groups: [
    { name: "heading", title: "Heading" },
    { name: "settings", title: "Settings" },
    { name: "social", title: "Social Media" },
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
      name: "layout",
      title: "Layout",
      group: "settings",
      type: "string",
      options: {
        list: [
          { title: "Grid", value: "grid" },
          { title: "List", value: "list" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "documentType",
      title: "Document Type",
      type: "string",
      description: "Select which type of documents to show",
      group: "settings",
      options: {
        list: [
          { title: "Page", value: "page" },
          { title: "Blog", value: "blog" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parentPage",
      title: "Parent Page",
      description:
        "Only show children of this page. Works alongside category filters. " +
        "Useful for listing sibling pages (e.g. all pages under 'Practice Areas').",
      type: "reference",
      group: "settings",
      to: [{ type: "page" }, { type: "blog" }],
      options: {
        disableNew: true,
      },
      hidden: ({ parent }) => parent?.documentType !== "page",
    }),
    defineField({
      name: "includeFilters",
      title: "Include Filters",
      description:
        "Only documents assigned to the selected categories will be fetched on the server.",
      group: "settings",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "excludeFilters",
      title: "Exclude Filters",
      description:
        "Documents assigned to the selected categories will NOT be fetched on the server.",
      group: "settings",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "limit",
      title: "Maximum number of documents",
      group: "settings",
      type: "number",
      description: "Optional: Limit the number of documents shown",
    }),
    defineField({
      name: "categoryFilters",
      title: "Category Filters",
      description:
        "These categories appear in the sidebar as interactive filters for users to refine the displayed documents.",
      group: "settings",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
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
        ...layoutOptionSimple,
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
        title: title || "Document List Block",
      };
    },
  },
});

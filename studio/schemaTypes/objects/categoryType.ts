import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";
import { HierarchicalSlugInput } from "../../components/HierarchicalSlugInput";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "site",
      title: "Site",
      type: "reference",
      to: [{ type: "site" }],
      readOnly: true,
      description: "This category belongs to the selected site",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The name of the category.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "Used for the page URL",
      type: "slug",
      components: {
        input: HierarchicalSlugInput,
      },
      options: {
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "children",
      title: "Children",
      type: "array",
      of: [{ type: "string" }],
      hidden: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Short description of what this category is about.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      parent: "parent.title",
    },
    prepare({ title, parent }) {
      return {
        title,
        subtitle: parent ? `Parent: ${parent}` : "Top-level",
      };
    },
  },
});

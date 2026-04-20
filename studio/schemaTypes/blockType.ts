import { defineType, defineField } from "sanity";

export const blockType = defineType({
  name: "block",
  title: "Block (Base Type)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal title for identifying this block",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});

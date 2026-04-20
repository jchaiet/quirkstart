import { defineField, defineType } from "sanity";

export const spacerType = defineType({
  name: "spacer",
  type: "object",
  title: "Spacer",
  fields: [
    defineField({
      name: "style",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
      },
      initialValue: "medium",
    }),
  ],
  preview: {
    select: { style: "style" },
    prepare({ style }) {
      return {
        title: `Spacer (${style || "medium"})`,
      };
    },
  },
});

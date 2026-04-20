import { defineField, defineType } from "sanity";

export const dividerType = defineType({
  name: "divider",
  type: "object",
  title: "Divider",
  fields: [
    defineField({
      name: "style",
      type: "string",
      options: {
        list: ["default"],
      },
      initialValue: "default",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Divider",
      };
    },
  },
});

import { defineField } from "sanity";

export const idField = defineField({
  name: "id",
  title: "ID",
  type: "string",
  description: "Unique identifier",
  validation: (Rule) =>
    Rule.regex(/^[a-zA-Z0-9-_]+$/, {
      name: "alphanumeric with dashes/underscores",
    }).warning("Avoid spaces or special characters"),
});

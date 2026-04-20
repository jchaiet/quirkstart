import { defineField } from "sanity";

export const widthOptionType = [
  defineField({
    name: "maxWidth",
    title: "Max Width",
    description: "Max-width for the container (e.g. '600px')",
    type: "string",
    group: "width",
  }),
];

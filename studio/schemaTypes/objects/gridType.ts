import { defineType, defineField } from "sanity";

export const gridType = defineType({
  name: "grid",
  type: "object",
  title: "Grid",
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: "columns",
      title: "Columns",
      type: "object",
      fields: [
        { name: "xs", title: "XS", type: "string" },
        { name: "sm", title: "SM (480px)", type: "string" },
        { name: "md", title: "MD (768px)", type: "string" },
        { name: "lg", title: "LG (1024px)", type: "string" },
        { name: "xl", title: "XL (1280px)", type: "string" },
      ],
      description: "Set the number of columns per breakpoint",
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: "gap",
      title: "Gap",
      type: "string",
      description: "Gap between grid items (e.g. '1rem')",
    }),
    defineField({
      name: "autoFitMinMax",
      title: "AutoFit MinMax",
      type: "string",
      description: "Auto-fit items with min size",
    }),
    defineField({
      name: "areas",
      title: "Grid Areas",
      type: "array",
      description:
        "Define named grid areas. Each row is an array of area names, e.g. ['header header', 'sidebar main]",
      of: [
        {
          type: "string",
          description:
            "Enter a space-separated list of area names for one row, e.g. 'sidebar main main'",
        },
      ],
      options: {
        layout: "list",
      },
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "card" }],
    }),
    defineField({
      name: "className",
      type: "string",
      title: "Custom Grid className",
    }),
  ],
});

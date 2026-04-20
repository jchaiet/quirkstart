import { defineType, defineField } from "sanity";

export const callToActionType = defineType({
  name: "callToAction",
  type: "object",
  title: "Call To Action",
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "alignment",
      title: "Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
    defineField({
      name: "spacing",
      title: "Spacing",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "sm" },
          { title: "Medium", value: "md" },
          { title: "Large", value: "lg" },
        ],
        layout: "radio",
      },
      initialValue: "md",
    }),
    defineField({
      name: "mobileOrientation",
      title: "Mobile Layout",
      description:
        "Controls button direction on small screens. Use Row for icon-only buttons.",
      type: "string",
      options: {
        list: [
          { title: "Column (default)", value: "column" },
          { title: "Row", value: "row" },
        ],
        layout: "radio",
      },
      initialValue: "column",
    }),
  ],
});

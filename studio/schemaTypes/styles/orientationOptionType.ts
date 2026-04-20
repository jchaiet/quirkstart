import { defineField } from "sanity";

export const orientationOptionType = [
  defineField({
    name: "orientation",
    title: "Orientation Options",
    type: "string",
    group: "layout",
    options: {
      layout: "radio",
      list: [
        {
          title: "Horizontal",
          value: "orientationHorizontal",
        },
        {
          title: "Vertical",
          value: "orientationVertical",
        },
      ],
    },
  }),
];

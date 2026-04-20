import { defineField } from "sanity";

export const backgroundOptionType = [
  defineField({
    name: "background",
    title: "Background Options",
    type: "string",
    group: "background",
    options: {
      layout: "radio",
      list: [
        {
          title: "Transparent",
          value: "backgroundTransparent",
        },
        {
          title: "White",
          value: "backgroundWhite",
        },
        {
          title: "Primary",
          value: "backgroundPrimary",
        },
        {
          title: "Primary - Light",
          value: "backgroundPrimaryLight",
        },
        {
          title: "Secondary",
          value: "backgroundSecondary",
        },
      ],
    },
  }),
];

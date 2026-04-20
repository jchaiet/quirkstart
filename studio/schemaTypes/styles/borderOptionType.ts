import { defineField } from "sanity";

export const borderOptionType = [
  defineField({
    name: "border",
    title: "Border Options",
    type: "string",
    group: "border",
    options: {
      layout: "radio",
      list: [
        {
          title: "None",
          value: "borderNone",
        },
        {
          title: "Primary",
          value: "borderPrimary",
        },
        {
          title: "Primary - Light",
          value: "borderPrimaryLight",
        },
        {
          title: "Secondary",
          value: "borderSecondary",
        },
        {
          title: "Secondary - Light",
          value: "borderSecondaryLight",
        },
      ],
    },
  }),
];

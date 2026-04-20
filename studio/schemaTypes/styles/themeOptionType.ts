import { defineField } from "sanity";

export const themeOptionType = [
  defineField({
    name: "theme",
    title: "Theme Options",
    type: "string",
    group: "theme",
    options: {
      layout: "radio",
      list: [
        {
          title: "Default",
          value: "themeDefault",
        },
        {
          title: "Light",
          value: "themeLight",
        },
        {
          title: "Dark",
          value: "themeDark",
        },
        {
          title: "Transparent",
          value: "themeTransparent",
        },
      ],
    },
  }),
];

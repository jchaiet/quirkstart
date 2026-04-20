import { defineField } from "sanity";

export const paddingOptionType = [
  defineField({
    name: "padding",
    title: "Padding Options",
    type: "array",
    of: [{ type: "string" }],
    group: "padding",
    options: {
      layout: "list",
      list: [
        { title: "Padding - Banner", value: "paddingBanner" },
        { title: "Padding - Top - 4rem", value: "paddingTop4" },
        { title: "Padding - Bottom - 4rem", value: "paddingBottom4" },
        { title: "Padding - Top - 2rem", value: "paddingTop2" },
        { title: "Padding - Bottom - 2rem", value: "paddingBottom2" },
        { title: "Padding - Top - 1rem", value: "paddingTop1" },
        { title: "Padding - Bottom - 1rem", value: "paddingBottom1" },
        { title: "Remove Padding - Top", value: "removePaddingTop" },
        { title: "Remove Padding - Bottom", value: "removePaddingBottom" },
      ],
    },
  }),
];

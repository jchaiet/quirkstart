/**
 * styles/layoutOptionType.ts
 *
 * IMPORTANT: Values here must stay in sync with the `HeroLayout` union type
 * in quirk-ui (HeroBlock.types.d.ts). If you add or rename a layout in
 * QuirkUI, update the list below to match.
 *
 * Current QuirkUI HeroLayout values:
 *   "default" | "split" | "split-35-65" | "tile" | "fullBleed" | "blog"
 */

import { defineField } from "sanity";

export const layoutOptionType = [
  defineField({
    name: "layout",
    title: "Layout Options",
    type: "string",
    group: "layout",
    options: {
      layout: "radio",
      list: [
        {
          title: "Default",
          value: "default",
        },
        {
          title: "Blog",
          value: "blog",
        },
        {
          title: "Tile (image fills rounded tile, text overlays)",
          value: "tile",
        },
        {
          // Previously "full-bleed" — renamed to match QuirkUI HeroLayout type
          title: "Full Bleed (image spans full viewport width)",
          value: "fullBleed",
        },
        {
          title: "Split 50/50",
          value: "split",
        },
        {
          title: "Split 35/65",
          value: "split-35-65",
        },
      ],
    },
  }),
];

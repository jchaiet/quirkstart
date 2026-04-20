/**
 * styles/imageRadiusOptionType.ts
 *
 * Border radius option for image tiles in ContentBlock.
 * Used when an image is displayed as a large background-cover tile
 * and an editor needs to control the corner rounding.
 *
 * Values map directly to the CSS custom property scale:
 *   --radius-sm   → 0.25rem
 *   --radius-md   → 0.5rem
 *   --radius-lg   → 1rem
 *   --radius-full → 9999px
 *
 * "none" is the default — no border-radius applied.
 * Consumed in QuirkUI's ContentBlock via the styleOptions.imageRadius value.
 */

import { defineField } from "sanity";

export const imageRadiusOptionType = [
  defineField({
    name: "imageRadius",
    title: "Image Corner Radius",
    description: "Applies a border-radius to cover/tile images in this block.",
    type: "string",
    group: "imageRadius",
    options: {
      layout: "radio",
      list: [
        { title: "None", value: "imageRadius-none" },
        { title: "Small", value: "imageRadius-sm" },
        { title: "Medium", value: "imageRadius-md" },
        { title: "Large", value: "imageRadius-lg" },
        { title: "Full", value: "imageRadius-full" },
      ],
    },
    initialValue: "none",
  }),
];

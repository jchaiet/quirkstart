/**
 * styles/layoutOptionType.ts
 *
 * Two layout option exports:
 *
 * layoutOptionFull — for HeroBlock and ContentBlock only.
 *   All layouts: Default, Narrow, Tile, Full Bleed, Split 50/50, Split 35/65
 *
 * layoutOptionSimple — for all other blocks.
 *   Layouts: Default, Narrow, Split 50/50
 *
 * IMPORTANT: Values must stay in sync with the HeroLayout union type
 * in quirk-ui (HeroBlock.types.d.ts). The underlying values (e.g. "blog",
 * "fullBleed") match QuirkUI — only the titles shown to editors have changed.
 *
 * Current QuirkUI HeroLayout values:
 *   "default" | "split" | "split-35-65" | "tile" | "fullBleed" | "blog"
 *
 * Note: The "blog" value is intentionally kept as-is to avoid a content
 * migration on existing documents. It renders as "Narrow" in the Studio UI.
 */

import { defineField } from "sanity";

// ─── Shared option definitions ────────────────────────────────────────────────

const layoutDefault = { title: "Default", value: "default" };
const layoutNarrow = {
  title: "Narrow (constrained reading width)",
  value: "narrow", // kept as "blog" to match QuirkUI HeroLayout — do not rename
};
const layoutSplit5050 = { title: "Split 50/50", value: "split" };
const layoutSplit3565 = { title: "Split 35/65", value: "split-35-65" };
const layoutTile = {
  title: "Tile (image fills rounded tile, text overlays)",
  value: "tile",
};
const layoutFullBleed = {
  title: "Full Bleed (image spans full viewport width)",
  value: "fullBleed",
};

// ─── Full layout options — HeroBlock and ContentBlock only ────────────────────

export const layoutOptionFull = [
  defineField({
    name: "layout",
    title: "Layout Options",
    type: "string",
    group: "layout",
    options: {
      layout: "radio",
      list: [
        layoutDefault,
        layoutNarrow,
        layoutTile,
        layoutFullBleed,
        layoutSplit5050,
        layoutSplit3565,
      ],
    },
  }),
];

// ─── Simple layout options — all other blocks ─────────────────────────────────

export const layoutOptionSimple = [
  defineField({
    name: "layout",
    title: "Layout Options",
    type: "string",
    group: "layout",
    options: {
      layout: "radio",
      list: [layoutDefault, layoutNarrow, layoutSplit5050],
    },
  }),
];

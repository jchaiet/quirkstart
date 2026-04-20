/**
 * styles/styleOptionsField.ts
 *
 * Composable helper that builds the `styleOptions` field for any block.
 * Instead of manually spreading style arrays in every block, call:
 *
 *   styleOptionsField(["padding", "background"])
 *
 * This returns a partial `defineField` config ready to spread into your block.
 *
 * NOTE: "layout" is only valid for heroBlock. All other blocks should omit it.
 * Passing "layout" to a non-hero block will log a warning in development.
 *
 * NOTE: padding is intentionally type: "array" (multi-select) — all other
 * style options are single strings. This is by design so multiple padding
 * classes can stack (e.g. paddingTop4 + paddingBottom2).
 */

import { type FieldDefinition } from "sanity";
import { backgroundOptionType } from "./backgroundOptionType";
import { borderOptionType } from "./borderOptionType";
import { layoutOptionType } from "./layoutOptionType";
import { orientationOptionType } from "./orientationOptionType";
import { paddingOptionType } from "./paddingOptionType";
import { themeOptionType } from "./themeOptionType";
import { widthOptionType } from "./widthOptionType";
import { imageRadiusOptionType } from "./imageRadiusOptionType";

export type StyleGroup =
  | "layout" // ← heroBlock only
  | "padding"
  | "background"
  | "border"
  | "imageRadius" // ← contentBlock image tiles
  | "theme"
  | "width"
  | "orientation";

const GROUP_DEFS: Record<StyleGroup, { name: string; title: string }> = {
  layout: { name: "layout", title: "Layout" },
  padding: { name: "padding", title: "Padding" },
  background: { name: "background", title: "Background" },
  border: { name: "border", title: "Border" },
  theme: { name: "theme", title: "Theme" },
  width: { name: "width", title: "Width" },
  orientation: { name: "orientation", title: "Orientation" },
  imageRadius: { name: "imageRadius", title: "Image Radius" },
};

const FIELD_MAP: Record<StyleGroup, FieldDefinition[]> = {
  layout: layoutOptionType as FieldDefinition[],
  padding: paddingOptionType as FieldDefinition[],
  background: backgroundOptionType as FieldDefinition[],
  border: borderOptionType as FieldDefinition[],
  theme: themeOptionType as FieldDefinition[],
  width: widthOptionType as FieldDefinition[],
  orientation: orientationOptionType as FieldDefinition[],
  imageRadius: imageRadiusOptionType as FieldDefinition[],
};

// Blocks that are permitted to use the "layout" style group.
const LAYOUT_ALLOWED_BLOCKS = ["heroBlock"] as const;

/**
 * Returns a partial defineField config for the `styleOptions` object.
 * Spread this into your block's defineField call.
 *
 * @example — hero (layout allowed)
 * defineField({
 *   name: "styleOptions",
 *   ...styleOptionsField(["layout", "padding", "background"], "heroBlock"),
 * })
 *
 * @example — all other blocks
 * defineField({
 *   name: "styleOptions",
 *   ...styleOptionsField(["padding", "background"]),
 * })
 */
export function styleOptionsField(groups: StyleGroup[], blockName?: string) {
  if (
    groups.includes("layout") &&
    blockName &&
    !LAYOUT_ALLOWED_BLOCKS.includes(
      blockName as (typeof LAYOUT_ALLOWED_BLOCKS)[number],
    )
  ) {
    console.warn(
      `[styleOptionsField] "layout" is intended for heroBlock only. ` +
        `Remove it from "${blockName}" or this will expose irrelevant layout options to editors.`,
    );
  }

  return {
    title: "Style Options",
    type: "object" as const,
    options: {
      collapsible: true,
      collapsed: false,
    },
    groups: groups.map((g) => GROUP_DEFS[g]),
    fields: groups.flatMap((g) => FIELD_MAP[g]),
  };
}

/**
 * styles/index.ts
 *
 * Single source of truth for all block styleOptions fields.
 *
 * Usage in a block schema:
 *
 *   import { styleOptionsField } from "../styles";
 *
 *   defineField({
 *     name: "styleOptions",
 *     ...styleOptionsField(["layout", "padding", "background"]),
 *   })
 *
 * Pass only the groups your block needs. Available groups:
 *   "layout" | "padding" | "background" | "border" | "theme" | "width" | "orientation"
 */

export { backgroundOptionType } from "./backgroundOptionType";
export { borderOptionType } from "./borderOptionType";
export { layoutOptionType } from "./layoutOptionType";
export { orientationOptionType } from "./orientationOptionType";
export { paddingOptionType } from "./paddingOptionType";
export { themeOptionType } from "./themeOptionType";
export { widthOptionType } from "./widthOptionType";
export { imageRadiusOptionType } from "./imageRadiusOptionType";
export { styleOptionsField, type StyleGroup } from "./styleOptionsField";

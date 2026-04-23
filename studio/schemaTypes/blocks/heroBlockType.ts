/**
 * schemaTypes/blocks/heroBlockType.ts
 */

import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { paddingOptionType } from "../styles/paddingOptionType";
import { layoutOptionFull } from "../styles/layoutOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { imageRadiusOptionType } from "../styles/imageRadiusOptionType";
import { SyncedImageInput } from "../../components/SyncedImageInput";
import { idField } from "../fields/idField";

export const heroBlockType = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  icon: ImageIcon,
  groups: [
    { name: "heading", title: "Heading" },
    { name: "media", title: "Media" },
    { name: "content", title: "Content" },
    { name: "callToAction", title: "Call To Action" },
    { name: "styles", title: "Styles" },
  ],
  fields: [
    idField,
    defineField({
      name: "heading",
      type: "heading",
      title: "Heading",
      group: "heading",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithLayout",
      group: "media",
      components: {
        input: SyncedImageInput,
      },
    }),
    defineField({
      name: "video",
      title: "Video",
      description: "Paste a YouTube or direct video URL",
      type: "string",
      group: "media",
    }),
    defineField({
      name: "callToAction",
      title: "Call to Action",
      type: "callToAction",
      group: "callToAction",
    }),
    defineField({
      name: "styleOptions",
      title: "Style Options",
      type: "object",
      group: "styles",
      options: {
        collapsible: true,
        collapsed: false,
      },
      groups: [
        { name: "padding", title: "Padding" },
        { name: "layout", title: "Layout" },
        { name: "imageRadius", title: "Image Radius" },
        { name: "background", title: "Background" },
      ],
      fields: [
        ...paddingOptionType,
        ...layoutOptionFull,
        ...imageRadiusOptionType,
        ...backgroundOptionType,
      ],
    }),
  ],
  preview: {
    select: {
      titleBlock: "heading",
      media: "image.defaultImage",
    },
    prepare({ titleBlock, media }) {
      let subtitle = "";

      if (Array.isArray(titleBlock)) {
        const block = titleBlock.find((b: any) => b._type === "block");
        subtitle = block?.children?.map((c: any) => c.text).join(" ") ?? "";
      }

      return {
        title: "Hero",
        subtitle,
        media,
      };
    },
  },
});

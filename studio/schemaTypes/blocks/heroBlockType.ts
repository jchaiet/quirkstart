/**
 * schemaTypes/blocks/heroBlockType.ts
 */

import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { styleOptionsField } from "../styles/styleOptionsField";
import { SyncedImageInput } from "../../components/SyncedImageInput";
import { idField } from "../fields/idField";

export const heroBlockType = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  icon: ImageIcon,
  fields: [
    idField,
    defineField({
      name: "heading",
      type: "heading",
      title: "Heading",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithLayout",
      components: {
        input: SyncedImageInput,
      },
    }),
    defineField({
      name: "video",
      title: "Video",
      description: "Paste a YouTube or direct video URL",
      type: "string",
    }),
    defineField({
      name: "callToAction",
      title: "Call to Action",
      type: "callToAction",
    }),
    defineField({
      name: "styleOptions",
      ...styleOptionsField(["layout", "padding", "background"], "heroBlock"),
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

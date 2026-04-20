import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { paddingOptionType } from "../styles/paddingOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { styleOptionsField } from "../styles/styleOptionsField";

import { idField } from "../fields/idField";

export const stickyScrollBlockType = defineType({
  name: "stickyScrollBlock",
  title: "Sticky Scroll Block",
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
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          name: "stickyScrollSection",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "richText",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "richText",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "imageWithLayout",
            }),
            defineField({
              name: "callToAction",
              title: "Call to Action",
              type: "callToAction",
            }),
            defineField({
              name: "styleOptions",
              ...styleOptionsField(["imageRadius"]),
            }),
          ],
          preview: {
            select: {
              titleBlock: "title",
              media: "image",
            },
            prepare({ titleBlock, media }) {
              let subtitle = "";

              if (Array.isArray(titleBlock)) {
                const block = titleBlock.find((b) => b._type === "block");
                subtitle = block?.children?.map((c: any) => c.text).join(" ");
              }
              return {
                title: subtitle,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "showNumbers",
      type: "boolean",
      title: "Show item numbers",
    }),
    defineField({
      name: "styleOptions",
      title: "Style Options",
      type: "object",
      options: {
        collapsible: true,
        collapsed: false,
      },
      groups: [
        { name: "padding", title: "Padding" },
        { name: "background", title: "Background" },
      ],
      fields: [...paddingOptionType, ...backgroundOptionType],
    }),
  ],
  preview: {
    select: {
      titleBlock: "heading",
      media: "image",
    },
    prepare({ titleBlock, media }) {
      let subtitle = "";

      if (Array.isArray(titleBlock)) {
        const block = titleBlock.find((b) => b._type === "block");
        subtitle = block?.children?.map((c: any) => c.text).join(" ");
      }
      return {
        title: "Sticky Scroll Block",
        subtitle: subtitle,
        media: media,
      };
    },
  },
});

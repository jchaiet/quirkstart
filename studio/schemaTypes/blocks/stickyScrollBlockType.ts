import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { paddingOptionType } from "../styles/paddingOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { idField } from "../fields/idField";
import { imageRadiusOptionType } from "../styles";

export const stickyScrollBlockType = defineType({
  name: "stickyScrollBlock",
  title: "Sticky Scroll Block",
  type: "object",
  icon: ImageIcon,
  groups: [
    { name: "heading", title: "Heading" },
    { name: "content", title: "Content" },
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
      name: "items",
      title: "Items",
      group: "content",
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
              title: "Style Options",
              type: "object",
              options: {
                collapsible: true,
                collapsed: false,
              },
              groups: [
                { name: "imageRadius", title: "Image Radius" },
                { name: "padding", title: "Padding" },
                { name: "background", title: "Background" },
              ],
              fields: [
                ...imageRadiusOptionType,
                ...paddingOptionType,
                ...backgroundOptionType,
              ],
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
      group: "content",
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

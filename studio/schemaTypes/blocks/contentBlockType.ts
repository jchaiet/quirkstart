import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { paddingOptionType } from "../styles/paddingOptionType";
import { layoutOptionFull } from "../styles/layoutOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { imageRadiusOptionType } from "../styles/imageRadiusOptionType";
import { idField } from "../fields/idField";

export const contentBlockType = defineType({
  name: "contentBlock",
  title: "Content Block",
  type: "object",
  icon: ImageIcon,
  groups: [
    { name: "layout", title: "Layout" },
    { name: "heading", title: "Heading" },
    { name: "media", title: "Media" },
    { name: "content", title: "Content" },
    { name: "callToAction", title: "Call To Action" },
    { name: "styles", title: "Styles" },
  ],
  fields: [
    idField,
    defineField({
      name: "layout",
      title: "Layout",
      group: "layout",
      type: "object",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "orientation",
          title: "Orientation",
          type: "string",
          options: {
            list: [
              { title: "No Image", value: "no-image" },
              { title: "Vertical (Image Top)", value: "vertical-image-top" },
              {
                title: "Vertical (Image Bottom)",
                value: "vertical-image-bottom",
              },
              {
                title: "Horizontal (Image Right)",
                value: "horizontal-image-right",
              },
              {
                title: "Horizontal (Image Left)",
                value: "horizontal-image-left",
              },
            ],
            layout: "radio",
          },
          initialValue: "no-image",
        }),
        defineField({
          name: "gap",
          title: "Custom Gap",
          type: "string",
          description:
            "Gap between image and content (e.g. '1rem'). Default for vertical is 1rem, default for Horizonal is 5rem",
        }),
      ],
    }),
    defineField({
      name: "heading",
      type: "heading",
      group: "heading",
      title: "Heading",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithLayout",
      group: "media",
      hidden: ({ parent }) => parent?.layout?.orientation === "no-image",
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "string",
      group: "media",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      group: "content",
      of: [
        {
          name: "metricItem",
          type: "object",
          fields: [
            defineField({
              name: "metricDescription",
              title: "Description",
              type: "richText",
            }),
            defineField({
              name: "metricValue",
              title: "Metric Value",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "callToAction",
      type: "callToAction",
      title: "Call To Action",
      group: "callToAction",
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer",
      type: "richText",
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
      titleBlock: "title",
      media: "image.defaultImage",
    },
    prepare({ titleBlock, media }) {
      let subtitle = "";

      if (Array.isArray(titleBlock)) {
        const block = titleBlock.find((b) => b._type === "block");
        subtitle = block?.children?.map((c: any) => c.text).join(" ");
      }
      return {
        title: "Content Block",
        subtitle: subtitle,
        media: media,
      };
    },
  },
});

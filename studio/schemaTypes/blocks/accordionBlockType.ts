import { defineType, defineField } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";
import { paddingOptionType } from "../styles/paddingOptionType";
import { layoutOptionSimple } from "../styles/layoutOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { idField } from "../fields/idField";

export const accordionBlockType = defineType({
  name: "accordionBlock",
  title: "Accordion Block",
  type: "object",
  icon: HelpCircleIcon,
  groups: [
    { name: "heading", title: "Heading" },
    { name: "settings", title: "Settings" },
    { name: "callToAction", title: "Call To Action" },
    { name: "styles", title: "Styles" },
  ],
  fields: [
    idField,
    defineField({
      name: "heading",
      type: "heading",
      group: "heading",
      title: "Heading",
    }),
    defineField({
      name: "items",
      title: "Items",
      group: "settings",
      type: "array",
      of: [
        {
          name: "accordionItem",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "content",
              title: "Content",
              type: "richText",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "imageWithLayout",
            }),
          ],
          preview: {
            select: {
              title: "title",
            },
          },
        },
      ],
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
        { name: "background", title: "Background" },
      ],
      fields: [
        ...paddingOptionType,
        ...layoutOptionSimple,
        ...backgroundOptionType,
      ],
    }),
  ],
  preview: {
    select: {
      titleBlock: "heading",
    },
    prepare({ titleBlock }) {
      let subtitle = "";

      if (Array.isArray(titleBlock)) {
        const block = titleBlock.find((b) => b._type === "block");
        subtitle = block?.children?.map((c: any) => c.text).join(" ");
      }
      return {
        title: "Accordion Block",
        subtitle: subtitle,
      };
    },
  },
});

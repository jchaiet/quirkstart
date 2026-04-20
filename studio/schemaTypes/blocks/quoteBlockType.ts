import { defineType, defineField } from "sanity";
import { BlockquoteIcon } from "@sanity/icons";
import { paddingOptionType } from "../styles/paddingOptionType";
import { layoutOptionType } from "../styles/layoutOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { idField } from "../fields/idField";

export const quoteBlockType = defineType({
  name: "quoteBlock",
  title: "Quote Block",
  type: "object",
  icon: BlockquoteIcon,
  fields: [
    idField,
    defineField({
      name: "quote",
      title: "Quote Text",
      type: "richText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author (Optional)",
      type: "string",
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Pull Quote", value: "pull" },
          { title: "Hero Quote", value: "hero" },
          { title: "Callout", value: "callout" },
        ],
        layout: "dropdown",
      },
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
        { name: "layout", title: "Layout" },
        { name: "background", title: "Background" },
      ],
      fields: [
        ...paddingOptionType,
        ...layoutOptionType,
        ...backgroundOptionType,
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Quote Block",
      };
    },
  },
});

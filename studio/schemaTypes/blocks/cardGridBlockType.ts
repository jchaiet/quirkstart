import { defineType, defineField } from "sanity";
import { ThLargeIcon } from "@sanity/icons";
import { layoutOptionType } from "../styles/layoutOptionType";
import { paddingOptionType } from "../styles/paddingOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { idField } from "../fields/idField";

export const cardGridBlockType = defineType({
  name: "cardGridBlock",
  type: "object",
  title: "Card Grid",
  icon: ThLargeIcon,
  groups: [
    { name: "heading", title: "Heading" },
    { name: "content", title: "Content" },
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
      name: "grid",
      type: "grid",
      group: "content",
      title: "Grid",
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
        ...layoutOptionType,
        ...backgroundOptionType,
      ],
    }),
  ],
  preview: {
    select: {
      titleBlock: "title",
    },
    prepare({ titleBlock }) {
      let subtitle = "";

      if (Array.isArray(titleBlock)) {
        const block = titleBlock.find((b) => b._type === "block");
        subtitle = block?.children?.map((c: any) => c.text).join(" ");
      }
      return {
        title: "Card Grid",
        subtitle: subtitle,
      };
    },
  },
});

import { defineType, defineField } from "sanity";
import { InlineElementIcon } from "@sanity/icons";
import { layoutOptionSimple } from "../styles/layoutOptionType";
import { paddingOptionType } from "../styles/paddingOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { idField } from "../fields/idField";

export const carouselBlockType = defineType({
  name: "carouselBlock",
  type: "object",
  title: "Carousel",
  icon: InlineElementIcon,
  groups: [
    { name: "heading", title: "Heading" },
    { name: "settings", title: "Settings" },
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
      name: "carouselOptions",
      type: "object",
      title: "Carousel Options",
      group: "settings",
      fields: [
        defineField({
          name: "itemsPerPage",
          title: "Items per Page",
          type: "number",
        }),
        defineField({
          name: "itemsPerRow",
          title: "Items per Row",
          type: "number",
        }),
        defineField({
          name: "autoplay",
          title: "Autoplay",
          type: "boolean",
          description: "Carousel will autoplay.",
        }),
        defineField({
          name: "autoplayInterval",
          title: "Autoplay Interval",
          type: "number",
          description: "Time in seconds before carousel moves to next item.",
        }),
        defineField({
          name: "showReview",
          type: "boolean",
          title: "Show review",
        }),
        defineField({
          name: "ratingSingleton",
          title: "Rating Singleton",
          type: "reference",
          to: [{ type: "singleton" }],
          hidden: ({ parent }) => !parent?.showReview,
        }),
        // defineField({
        //   name: "rating",
        //   title: "Rating (out of 5)",
        //   type: "number",
        // }),
        // defineField({
        //   name: "description",
        //   title: "Description",
        //   type: "richText",
        //   hidden: ({ parent }) => !parent?.showReview,
        // }),
      ],
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      group: "content",
      of: [{ type: "card" }],
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
      titleBlock: "title",
    },
    prepare({ titleBlock }) {
      let subtitle = "";

      if (Array.isArray(titleBlock)) {
        const block = titleBlock.find((b) => b._type === "block");
        subtitle = block?.children?.map((c: any) => c.text).join(" ");
      }
      return {
        title: "Carousel",
        subtitle: subtitle,
      };
    },
  },
});

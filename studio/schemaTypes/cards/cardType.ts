import { defineType, defineField } from "sanity";
import { InlineElementIcon } from "@sanity/icons";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { borderOptionType } from "../styles/borderOptionType";

export const cardType = defineType({
  name: "card",
  type: "object",
  title: "Card",
  icon: InlineElementIcon,
  groups: [
    { name: "heading", title: "Heading" },
    { name: "settings", title: "Settings" },
    { name: "media", title: "Media" },
    { name: "content", title: "Content" },
    { name: "cta", title: "Call To Action" },
    { name: "styles", title: "Styles" },
  ],
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "Grid", value: "grid" },
          { title: "Product", value: "product" },
          { title: "Segment", value: "segment" },
          { title: "Service", value: "service" },
          { title: "Testimonial", value: "testimonial" },
          // { title: "Image", value: "image" },
          { title: "Review", value: "review" },
          { title: "Bio", value: "bio" },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "Full Bleed", value: "full-bleed" },
          { title: "Text Only", value: "text" },
          { title: "Metric", value: "metric" },
          { title: "Image Left", value: "image-left" },
          { title: "Image Right", value: "image-right" },
          { title: "Image Top", value: "image-top" },
          { title: "Image Bottom", value: "image-bottom" },
          { title: "Image Only", value: "image-only" },
        ],
        layout: "radio",
      },
      initialValue: "text",
      hidden: ({ parent }) =>
        parent?.variant !== "bio" &&
        parent?.variant !== "grid" &&
        parent?.variant !== "testimonial",
    }),
    defineField({
      name: "gridArea",
      title: "Grid Area",
      description: "The corresponding grid area name from the parent grid.",
      type: "string",
      group: "settings",
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "richText",
      group: "content",
      hidden: ({ parent }) => parent?.variant === "review",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "richText",
      hidden: ({ parent }) => parent?.variant === "review",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "richText",
      group: "content",
    }),
    defineField({
      name: "person",
      title: "Person",
      type: "richText",
      group: "content",
      hidden: ({ parent }) => parent?.variant !== "testimonial",
    }),
    defineField({
      name: "rating",
      title: "Rating (out of 5)",
      type: "number",
      group: "content",
      hidden: ({ parent }) => parent?.variant !== "review",
    }),
    defineField({
      name: "metricValue",
      title: "Metric Value",
      type: "string",
      group: "content",
      hidden: ({ parent }) => parent?.style !== "metric",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithLayout",
      group: "media",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "FontAwesome class (e.g. 'fas fa-link')",
      type: "string",
      group: "media",
    }),
    defineField({
      name: "callToAction",
      title: "Call to Action",
      type: "link",
      group: "cta",
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
        { name: "background", title: "Background" },
        { name: "border", title: "Border" },
      ],
      fields: [...backgroundOptionType, ...borderOptionType],
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
        title: "Card",
        subtitle: subtitle,
        media: media,
      };
    },
  },
});

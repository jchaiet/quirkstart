import { defineType, defineField } from "sanity";
import { InlineElementIcon } from "@sanity/icons";

export const ratingType = defineType({
  name: "rating",
  type: "object",
  title: "Rating",
  icon: InlineElementIcon,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "richText",
    }),
    defineField({
      name: "rating",
      title: "Rating (out of 5)",
      type: "number",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "richText",
    }),
  ],
});

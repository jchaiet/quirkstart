import { defineType, defineField } from "sanity";
import { SyncedRichTextInput } from "../../components/SyncedRichTextInput";

export const headingType = defineType({
  name: "heading",
  type: "object",
  title: "Heading",
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "richText",
    }),
    defineField({
      name: "title",
      type: "richText",
      title: "Title",
      components: {
        input: SyncedRichTextInput,
      },
    }),
    defineField({
      name: "description",
      type: "richText",
      title: "Description",
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer",
      type: "richText",
    }),
    defineField({
      name: "animateText",
      description:
        "Allow heading text to be animated. Specific animations would be handled at the component level.",
      type: "boolean",
      title: "Animate text?",
    }),
    defineField({
      name: "headingLayout",
      title: "Heading Layout",
      type: "string",
      options: {
        list: [
          { title: "Vertical", value: "vertical" },
          {
            title: "Horizontal",
            value: "horizontal",
          },
        ],
        layout: "radio",
      },
      initialValue: "vertical",
    }),
  ],
});

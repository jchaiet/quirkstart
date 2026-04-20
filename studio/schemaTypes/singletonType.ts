import { SunIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { contentBlockType } from "./blocks/contentBlockType";

export const singletonType = defineType({
  name: "singleton",
  type: "document",
  title: "Singleton Block",
  icon: SunIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "identifier",
      title: "Unique Identifier",
      type: "slug",
      description: "A unique identifier for this singleton",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (Rule) =>
        Rule.required().error("A unique identifier is required"),
    }),
    defineField({
      name: "blockSelection",
      title: "Select Block Type",
      type: "string",
      options: {
        list: [
          {
            title: "Hero Block",
            value: "heroBlock",
          },
          {
            title: "Content Block",
            value: "contentBlock",
          },
          {
            title: "RichText Block",
            value: "richTextBlock",
          },
          {
            title: "Rating",
            value: "rating",
          },
        ],
        layout: "dropdown",
      },
      initialValue: "contentBlock",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blockContent",
      title: "Block Content",
      type: "object",
      fields: [
        defineField({
          name: "heroBlock",
          title: "Hero Block",
          type: "heroBlock",
          hidden: ({ parent, document }) =>
            document?.blockSelection !== "heroBlock",
        }),
        defineField({
          name: "contentBlock",
          title: "Content Block",
          type: "contentBlock",
          hidden: ({ parent, document }) =>
            document?.blockSelection !== "contentBlock",
        }),
        defineField({
          name: "richTextBlock",
          title: "RichText Block",
          type: "richTextBlock",
          hidden: ({ parent, document }) =>
            document?.blockSelection !== "richTextBlock",
        }),
        defineField({
          name: "rating",
          title: "Rating",
          type: "rating",
          hidden: ({ parent, document }) =>
            document?.blockSelection !== "rating",
        }),
      ],
      validation: (Rule) =>
        Rule.required().error("Please select or create content for this block"),
    }),
  ],
  preview: {
    select: {
      title: "identifier.current",
      blockType: "blockSelection",
      blockTitle: "block.title",
    },
    prepare({ title, blockType }) {
      return {
        title: title || `Singleton (${blockType})`,
      };
    },
  },
});

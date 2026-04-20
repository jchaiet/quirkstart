import { defineType, defineField } from "sanity";
import { MenuIcon } from "@sanity/icons";

export const navigationGroupType = defineType({
  name: "navigationGroup",
  title: "Navigation Group",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "title",
      title: "Group Title",
      description: "Used to as the label in the navigation",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "primaryItems",
      title: "Primary Items",
      type: "array",
      of: [{ type: "navigationItem" }],
    }),
    defineField({
      name: "secondaryItems",
      title: "Secondary Items",
      type: "array",
      of: [{ type: "navigationItem" }],
    }),
    defineField({
      name: "spotlight",
      title: "Spotlight Card",
      type: "object",
      fields: [
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
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "callToAction",
          title: "Call to Action",
          type: "link",
        }),
      ],
    }),
  ],
});

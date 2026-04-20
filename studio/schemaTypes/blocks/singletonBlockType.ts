import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";

export const singletonBlockType = defineType({
  name: "singletonBlock",
  title: "Singleton Block",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "referencedSingleton",
      title: "Select Singleton",
      type: "reference",
      to: [{ type: "singleton" }],
      description: "Choose an existing singleton",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "referencedSingleton.title",
      identifier: "referencedSingleton.identifier.current",
      blockSelection: "referencedSingleton.blockSelection",
    },
    prepare({ title, identifier, blockSelection }) {
      return {
        title: title || "Untitled Singleton",
        subtitle: `Instance: ${identifier || "No Identifier"} (${blockSelection || "Unknown Type"})`,
      };
    },
  },
});

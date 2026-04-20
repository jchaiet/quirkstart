/**
 * markdownBlockType.ts
 *
 * A page builder block for rendering markdown content.
 * Primary use case: documentation pages where README content
 * is pasted directly into Sanity.
 *
 * Uses @sanity/code-input (already installed) with language: "markdown"
 * for syntax highlighting in the Studio editor.
 */

import { defineType, defineField } from "sanity";
import { BlockContentIcon } from "@sanity/icons";
import { paddingOptionType } from "../styles/paddingOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { idField } from "../fields/idField";

export const markdownBlockType = defineType({
  name: "markdownBlock",
  title: "Markdown Block",
  type: "object",
  icon: BlockContentIcon,
  groups: [
    { name: "content", title: "Content" },
    { name: "styles", title: "Styles" },
  ],
  fields: [
    idField,
    defineField({
      name: "content",
      title: "Markdown Content",
      description:
        "Paste your markdown here. Supports GFM: tables, task lists, code blocks, strikethrough.",
      type: "code",
      group: "content",
      options: {
        language: "markdown",
        withFilename: false,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "maxWidth",
      title: "Content Width",
      type: "string",
      group: "styles",
      options: {
        list: [
          { title: "Small (640px)", value: "sm" },
          { title: "Medium (800px)", value: "md" },
          { title: "Large (1000px)", value: "lg" },
          { title: "Full width", value: "full" },
        ],
        layout: "radio",
      },
      initialValue: "lg",
    }),
    defineField({
      name: "styleOptions",
      title: "Style Options",
      type: "object",
      group: "styles",
      options: { collapsible: true, collapsed: true },
      groups: [
        { name: "padding", title: "Padding" },
        { name: "background", title: "Background" },
      ],
      fields: [...paddingOptionType, ...backgroundOptionType],
    }),
  ],
  preview: {
    select: {
      content: "content.code",
    },
    prepare({ content }) {
      // Show first non-empty line of markdown as subtitle
      const firstLine = content
        ?.split("\n")
        .find((l: string) => l.trim())
        ?.replace(/^#+\s*/, "") // strip heading markers
        ?.slice(0, 60);
      return {
        title: "Markdown Block",
        subtitle: firstLine || "Empty",
        media: BlockContentIcon,
      };
    },
  },
});

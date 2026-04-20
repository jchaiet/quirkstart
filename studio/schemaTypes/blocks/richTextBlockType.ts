import { defineType, defineField } from "sanity";
import { TextIcon, ComposeIcon } from "@sanity/icons";
import { paddingOptionType } from "../styles/paddingOptionType";
import { layoutOptionType } from "../styles/layoutOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { idField } from "../fields/idField";

export const richTextBlockType = defineType({
  name: "richTextBlock",
  title: "RichText Block",
  type: "object",
  icon: TextIcon,
  fields: [
    idField,
    defineField({
      name: "text",
      title: "Text",
      type: "richText",
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
    select: {
      content: "text",
      id: "id",
    },
    prepare({ content, id }) {
      const firstBlock = content?.find((block: any) => block._type === "block");
      const text =
        firstBlock?.children
          ?.map((child: any) => child.text)
          .join(" ")
          .trim() || "";
      // fallbacks for non-text blocks (image, code, divider, etc.)
      let title = text;
      if (!text && content?.length) {
        const first = content[0];
        switch (first._type) {
          case "image":
            title = "(Image)";
            break;
          case "code":
            title = "(Code Snippet)";
            break;
          case "divider":
            title = "(Divider)";
            break;
          case "spacer":
            title = "(Spacer)";
            break;
          case "table":
            title = "(Table)";
            break;
          default:
            title = "(Empty rich text)";
        }
      }

      return {
        title:
          title.length > 80
            ? title.slice(0, 80) + "…"
            : title || "(empty block)",
        subtitle: id ? `ID: ${id}` : undefined,
        media: ComposeIcon,
      };
    },
  },
});

import { defineArrayMember, defineField } from "sanity";
import {
  CodeBlockIcon,
  CodeIcon,
  ColorWheelIcon,
  ComposeIcon,
  ImageIcon,
  LinkIcon,
  NumberIcon,
  SortIcon,
} from "@sanity/icons";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const AlignLeftIcon = (
  <span
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <AlignLeft size={21} />
  </span>
);

const AlignCenterIcon = (
  <span
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <AlignCenter size={21} />
  </span>
);

const AlignRightIcon = (
  <span
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <AlignRight size={21} />
  </span>
);

export const richTextType = defineField({
  name: "richText",
  title: "Rich Text",
  icon: ComposeIcon,
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 1", value: "h1" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Heading 5", value: "h5" },
        { title: "Heading 6", value: "h6" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          {
            title: "Left",
            value: "left",
            icon: AlignLeftIcon,
          },
          {
            title: "Center",
            value: "center",
            icon: AlignCenterIcon,
          },
          {
            title: "Right",
            value: "right",
            icon: AlignRightIcon,
          },
          { title: "Number", value: "number", icon: NumberIcon },
          {
            title: "Inline Code",
            value: "inlineCode",
            icon: CodeBlockIcon,
          },
        ],
        annotations: [
          {
            name: "textSize",
            title: "Text Size",
            type: "object",
            icon: SortIcon,
            fields: [
              defineField({
                name: "size",
                title: "Size",
                type: "string",
                options: {
                  list: [
                    { title: "Small", value: "small" },
                    { title: "Medium", value: "medium" },
                    { title: "Large", value: "large" },
                    { title: "XLarge", value: "xlarge" },
                  ],
                  layout: "radio",
                },
                initialValue: "medium",
              }),
            ],
          },
          {
            name: "link",
            type: "object",
            title: "Link",
            icon: LinkIcon,
            fields: [
              defineField({
                name: "linkType",
                title: "Link Type",
                type: "string",
                options: {
                  list: [
                    { title: "Internal Link", value: "internal" },
                    { title: "External Link", value: "external" },
                  ],
                  layout: "radio",
                },
                initialValue: "internal",
              }),
              defineField({
                name: "internalUrl",
                title: "Internal Link",
                type: "reference",
                to: [{ type: "page" }, { type: "blog" }],
                hidden: ({ parent }) => parent?.linkType !== "internal",
              }),
              defineField({
                name: "externalUrl",
                title: "External URL",
                type: "url",
                hidden: ({ parent }) => parent?.linkType !== "external",
              }),
              defineField({
                name: "blank",
                type: "boolean",
                title: "Open in new tab",
                initialValue: false,
              }),
            ],
          },
          {
            name: "coloredText",
            title: "Colored Text",
            icon: ColorWheelIcon,
            type: "object",
            fields: [
              defineField({
                name: "colorClass",
                title: "Color Style",
                type: "string",
                options: {
                  list: [
                    { title: "Primary", value: "textPrimary" },
                    { title: "Secondary", value: "textSecondary" },
                  ],
                },
                initialValue: "textPrimary",
              }),
            ],
          },
          {
            name: "listColumns",
            title: "List Columns",
            type: "object",
            icon: SortIcon,
            fields: [
              defineField({
                name: "count",
                title: "Columns",
                type: "number",
                options: {
                  list: [
                    { title: "1 Column", value: 1 },
                    { title: "2 Columns", value: 2 },
                    { title: "3 Column", value: 3 },
                  ],
                },
                initialValue: 1,
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
    }),
    defineArrayMember({
      type: "code",
      icon: CodeIcon,
      options: {
        theme: "github",
        language: "javascript",
        withFilename: true,
      },
    }),
    defineArrayMember({
      type: "divider",
    }),
    defineArrayMember({
      type: "spacer",
    }),
    defineArrayMember({
      type: "table",
    }),
  ],
});

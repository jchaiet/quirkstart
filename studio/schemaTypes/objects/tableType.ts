import { defineArrayMember, defineField, defineType } from "sanity";
import { CodeBlockIcon, NumberIcon } from "@sanity/icons";

export const tableType = defineType({
  name: "table",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "hasHeadingRow",
      description: "The first row will be set as an <hr>",
      type: "boolean",
      title: "First row heading",
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          title: "Row",
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [
                defineArrayMember({
                  title: "Cell",
                  type: "object",
                  fields: [
                    defineField({
                      name: "content",
                      title: "Content",
                      type: "array",
                      of: [
                        defineArrayMember({
                          type: "block",
                          styles: [],
                          marks: {
                            decorators: [
                              { title: "Strong", value: "strong" },
                              { title: "Emphasis", value: "em" },
                              {
                                title: "Inline Code",
                                value: "inlineCode",
                                icon: CodeBlockIcon,
                              },
                            ],
                          },
                        }),
                      ],
                    }),
                  ],
                  preview: {
                    select: {
                      blocks: "content",
                    },
                    prepare({ blocks }) {
                      const block = (blocks || [])[0];
                      const text =
                        block && block.children
                          ? block.children
                              .map((child: any) => child.text)
                              .join("")
                              .slice(0, 40)
                          : "Empty cell";
                      return { title: text || "Empty cell" };
                    },
                  },
                }),
              ],
              options: {
                layout: "list",
              },
            }),
          ],
          preview: {
            select: {
              cells: "cells",
            },
            prepare({ cells }) {
              return {
                title: `Row (${cells?.length || 0} cells) `,
              };
            },
          },
        }),
      ],
      options: {
        sortable: true,
      },
    }),
  ],
  preview: {
    select: {
      rows: "rows",
      hasHeadingRow: "hasHeadingRow",
    },
    prepare({ rows = [], hasHeadingRow }) {
      const rowCount = rows.length;
      const label = hasHeadingRow ? "Heading row + " : "";

      return {
        title: `Table (${label}${rowCount} rows) `,
        subtitle: hasHeadingRow ? "First row used as header" : "Default table",
      };
    },
  },
});

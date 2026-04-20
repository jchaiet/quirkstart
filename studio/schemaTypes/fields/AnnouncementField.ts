/**
 * announcementField.ts
 *
 * Reusable object type embedded on page, blog, and docs documents.
 *
 * Inheritance logic (resolved server-side in resolveAnnouncement.ts):
 *  - If this page has announcement.content → use it
 *  - Else walk parent chain, use nearest ancestor with
 *    announcement.content AND announcement.applyToChildren = true
 */

import { defineField, defineType } from "sanity";
import { BellIcon } from "@sanity/icons";

export const announcementField = defineType({
  name: "announcement",
  title: "Announcement",
  type: "object",
  icon: BellIcon,
  fields: [
    defineField({
      name: "content",
      title: "Announcement Text",
      description:
        "Shown in a banner above the navigation. Supports bold, italic, and links.",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                  {
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "applyToChildren",
      title: "Apply to child pages",
      description:
        "When enabled, this announcement will also appear on all child pages unless they have their own announcement.",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => !parent?.content?.length,
    }),
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
});

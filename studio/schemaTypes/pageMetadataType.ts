import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

export const pageMetadataType = defineType({
  name: "pageMetadata",
  title: "Page Metadata",
  icon: DocumentsIcon,
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      description: "Appears in the browser tab and search results",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Appears in the search results",
      type: "string",
      validation: (rule) => rule.max(155),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "robots",
      title: "Robots Settings",
      type: "string",
      options: {
        list: [
          { title: "Index, Follow (Default)", value: "index, follow" },
          { title: "No Index, Follow", value: "noindex, follow" },
          { title: "Index, No Follow", value: "index, nofollow" },
          { title: "No Index, No Follow", value: "noindex, nofollow" },
        ],
        layout: "radio",
      },
      initialValue: "index, follow",
    }),
    defineField({
      name: "ogTitle",
      title: "OG Title",
      description: "Title for social sharing (defaults to Page Title)",
      type: "string",
    }),
    defineField({
      name: "ogDescription",
      title: "OG Description",
      description: "Description for social sharing (defaults to Description)",
      type: "string",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      description: "Recommended size: 1200x630px",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "twitterCard",
      title: "Twitter Card Type",
      type: "string",
      options: {
        list: [
          { title: "Summary", value: "summary" },
          { title: "Summary Large Image", value: "summary_large_image" },
        ],
      },
      initialValue: "summary_large_image",
    }),
  ],
});

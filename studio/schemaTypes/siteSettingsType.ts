import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General" },
    { name: "seo", title: "SEO" },
    { name: "social", title: "Social Media" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      group: "general",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "general",
      options: { hotspot: true },
    }),
    defineField({
      name: "siteIcon",
      title: "Site Icons / Favicon",
      type: "object",
      group: "general",
      fields: [
        defineField({
          name: "favicon",
          title: "Favicon (32x32 PNG or SVG)",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "appleTouchIcon",
          title: "Apple Touch Icon (180x180 PNG)",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "maskIcon",
          title: "Safari Mask Icon (SVG, monochrome)",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "defaultSEO",
      title: "Default SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "title",
          title: "Default SEO Title",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Default SEO Description",
          type: "text",
        }),
        defineField({
          name: "image",
          title: "Default SEO Image",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      group: "social",
      of: [
        defineField({
          name: "socialLink",
          title: "Social Link",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  "Twitter",
                  "Facebook",
                  "Instagram",
                  "LinkedIn",
                  "YouTube",
                  "TikTok",
                  "GitHub",
                ],
              },
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});

import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteType = defineType({
  name: "site",
  title: "Site / Brand",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General" },
    { name: "seo", title: "SEO" },
    { name: "social", title: "Social Media" },
    { name: "tracking", title: "Tracking" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "identifier",
      title: "Identifier (e.g. brand-a)",
      type: "slug",
      options: { source: "title", maxLength: 50 },
      group: "general",
    }),
    defineField({
      name: "domain",
      title: "Primary Domain",
      type: "url",
      group: "general",
    }),
    defineField({
      name: "defaultLocale",
      title: "Default Locale",
      type: "string",
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
    defineField({
      name: "defaultNavigation",
      title: "Default Navigation",
      type: "reference",
      to: [{ type: "navigation" }],
      group: "general",
    }),
    defineField({
      name: "defaultFooter",
      title: "Default Footer",
      type: "reference",
      to: [{ type: "navigation" }],
      group: "general",
    }),
    defineField({
      name: "trackingScripts",
      title: "Tracking Scripts",
      description:
        "Analytics and tracking scripts loaded on every page for this site.",
      type: "array",
      group: "tracking",
      of: [
        {
          type: "object",
          title: "Tracking Script",
          fields: [
            defineField({
              name: "type",
              title: "Script Type",
              type: "string",
              options: {
                list: [
                  { title: "Google Analytics 4 (GA4)", value: "GA4" },
                  { title: "Google Tag Manager (GTM)", value: "GTM" },
                  { title: "Meta Pixel", value: "MetaPixel" },
                  { title: "Custom Script", value: "Custom" },
                ],
                layout: "radio",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "measurementId",
              title: "Measurement ID",
              description:
                "GA4: G-XXXXXXXXXX · GTM: GTM-XXXXXXX · Meta Pixel: numeric ID",
              type: "string",
              hidden: ({ parent }) =>
                !parent?.type || parent?.type === "Custom",
              validation: (Rule) =>
                Rule.custom((val, ctx) => {
                  const type = (ctx.parent as any)?.type;
                  if (type && type !== "Custom" && !val) {
                    return "Measurement ID is required";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "customScript",
              title: "Custom Script",
              description:
                "Paste the full <script> tag or raw JS. Rendered server-side — do not include sensitive data.",
              type: "text",
              rows: 6,
              hidden: ({ parent }) => parent?.type !== "Custom",
              validation: (Rule) =>
                Rule.custom((val, ctx) => {
                  if ((ctx.parent as any)?.type === "Custom" && !val) {
                    return "Script content is required";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "strategy",
              title: "Load Strategy",
              description:
                "afterInteractive: after page is interactive (recommended for analytics). beforeInteractive: blocks page load. lazyOnload: lowest priority.",
              type: "string",
              options: {
                list: [
                  {
                    title: "After Interactive (recommended)",
                    value: "afterInteractive",
                  },
                  { title: "Before Interactive", value: "beforeInteractive" },
                  { title: "Lazy / On Load", value: "lazyOnload" },
                ],
                layout: "radio",
              },
              initialValue: "afterInteractive",
            }),
            defineField({
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "excludePaths",
              title: "Exclude Paths",
              description:
                "Script will NOT load on these paths. Supports wildcards e.g. /blog/*",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
            defineField({
              name: "includePaths",
              title: "Include Paths Only",
              description:
                "If set, script ONLY loads on these paths. Leave empty to load everywhere. Supports wildcards e.g. /blog/*",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
          ],
          preview: {
            select: {
              type: "type",
              measurementId: "measurementId",
              enabled: "enabled",
            },
            prepare({ type, measurementId, enabled }) {
              const labels: Record<string, string> = {
                GA4: "Google Analytics 4",
                GTM: "Google Tag Manager",
                MetaPixel: "Meta Pixel",
                Custom: "Custom Script",
              };
              return {
                title: labels[type] ?? type,
                subtitle: [measurementId, enabled ? "Enabled" : "Disabled"]
                  .filter(Boolean)
                  .join(" · "),
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "domain" },
  },
});

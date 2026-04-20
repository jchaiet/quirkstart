import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { orientationOptionType } from "../styles/orientationOptionType";
import { themeOptionType } from "../styles/themeOptionType";
import { paddingOptionType } from "../styles/paddingOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { layoutOptionType } from "../styles/layoutOptionType";
import { idField } from "../fields/idField";

export const tabsBlockType = defineType({
  name: "tabsBlock",
  title: "Tabs",
  type: "object",
  icon: ImageIcon,
  fields: [
    idField,
    defineField({
      name: "heading",
      type: "heading",
      title: "Heading",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          name: "tabItem",
          title: "Tab Item",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Tab Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "Tab Content",
              type: "object",
              fields: [
                defineField({
                  name: "tabText",
                  title: "Tab Text",
                  type: "richText",
                }),
                defineField({
                  name: "tabImage",
                  title: "Image",
                  type: "image",
                  options: { hotspot: true },
                }),
                defineField({ name: "tabLink", type: "link" }),
                defineField({
                  name: "tabGridItem",
                  title: "Tab Grid Items",
                  type: "array",
                  of: [
                    {
                      type: "object",
                      name: "gridItem",
                      title: "Grid Item",
                      fields: [
                        defineField({
                          name: "itemImage",
                          title: "Image",
                          type: "image",
                          options: { hotspot: true },
                        }),
                        defineField({
                          name: "itemText",
                          title: "Text",
                          type: "richText",
                        }),
                      ],
                      preview: {
                        select: {
                          titleBlock: "itemText",
                          media: "image",
                        },
                        prepare({ titleBlock, media }) {
                          let subtitle = "";

                          if (Array.isArray(titleBlock)) {
                            const block = titleBlock.find(
                              (b) => b._type === "block",
                            );
                            subtitle = block?.children
                              ?.map((c: any) => c.text)
                              .join(" ");
                          }
                          return {
                            title: subtitle,
                            media: media,
                          };
                        },
                      },
                    },
                  ],
                }),
                defineField({
                  name: "tabDisclaimer",
                  title: "Disclaimer",
                  type: "richText",
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "callToAction",
      title: "Call to Action",
      type: "callToAction",
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
        { name: "orientation", title: "Orientation" },
        { name: "theme", title: "Theme" },
        { name: "layout", title: "Layout" },
        { name: "padding", title: "Padding" },
        { name: "background", title: "Background" },
      ],
      fields: [
        ...orientationOptionType,
        ...themeOptionType,
        ...layoutOptionType,
        ...paddingOptionType,
        ...backgroundOptionType,
      ],
    }),
  ],
  preview: {
    select: {
      titleBlock: "heading",
      media: "image",
    },
    prepare({ titleBlock, media }) {
      let subtitle = "";

      if (Array.isArray(titleBlock)) {
        const block = titleBlock.find((b) => b._type === "block");
        subtitle = block?.children?.map((c: any) => c.text).join(" ");
      }
      return {
        title: "Tabs",
        subtitle: subtitle,
        media: media,
      };
    },
  },
});

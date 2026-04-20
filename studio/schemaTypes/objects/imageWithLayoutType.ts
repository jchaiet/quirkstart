import { defineType, defineField } from "sanity";

export const imageWithLayoutType = defineType({
  name: "imageWithLayout",
  type: "object",
  title: "Image",
  fields: [
    defineField({
      name: "defaultImage",
      title: "Default Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "darkImage",
      title: "Dark Mode Image (Optional)",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Full Bleed (Cover)", value: "cover" },
          { title: "Fit (Contain)", value: "contain" },
          { title: "Original Size", value: "none" },
        ],
        layout: "radio",
      },
      initialValue: "cover",
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      options: {
        list: [
          { title: "Center", value: "center" },
          { title: "Top", value: "top" },
          { title: "Bottom", value: "bottom" },
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
          { title: "Top Left", value: "top left" },
          { title: "Top Right", value: "top right" },
          { title: "Bottom Left", value: "bottom left" },
          { title: "Bottom Right", value: "bottom right" },
        ],
        layout: "dropdown",
      },
      initialValue: "center",
      hidden: ({ parent }) => parent?.layout !== "cover",
    }),
    defineField({
      name: "sizing",
      title: "Sizing",
      type: "string",
      options: {
        list: [
          { title: "Full Width", value: "full" },
          { title: "Half Width", value: "half" },
          { title: "Inset (Max Width)", value: "inset" },
        ],
      },
      initialValue: "full",
      hidden: ({ parent }) => parent?.layout !== "contain",
    }),
    defineField({
      name: "maxWidth",
      title: "Max Width",
      description: "Enter a max-width value (e.g. '150px').",
      type: "string",
      hidden: ({ parent }) => parent?.sizing !== "inset",
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          { title: "None", value: "" },
          { title: "16:9", value: "16:9" },
          { title: "4:3", value: "4:3" },
          { title: "1:1 (Square)", value: "1:1" },
        ],
      },
      initialValue: "",
      hidden: ({ parent }) => parent?.layout !== "contain",
    }),
  ],
});

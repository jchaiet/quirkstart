/**
 * formStepType.ts
 *
 * A single step in a multi-step form.
 * Single-step forms just use one step.
 */

import { defineType, defineField } from "sanity";

export const formStepType = defineType({
  name: "formStep",
  title: "Form Step",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Step Title",
      description: "Shown in the progress indicator",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Step Description",
      description: "Optional context shown above the fields",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "fields",
      title: "Fields",
      type: "array",
      of: [{ type: "formField" }],
      validation: (Rule) =>
        Rule.min(1).error("Each step needs at least one field"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      fields: "fields",
    },
    prepare({ title, fields }) {
      const count = fields?.length ?? 0;
      return {
        title: title || "Untitled Step",
        subtitle: `${count} field${count === 1 ? "" : "s"}`,
      };
    },
  },
});

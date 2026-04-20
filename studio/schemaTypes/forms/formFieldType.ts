/**
 * formFieldType.ts
 *
 * A single form field. Used inside formStepType.
 *
 * fieldType maps directly to QuirkUI components:
 *   text / email / phone / number / url  → Input (with appropriate type)
 *   textarea                             → Textarea
 *   select                               → Select (multiple=false)
 *   multiselect                          → Select (multiple=true)
 *   checkbox                             → Checkbox (single)
 *   checkboxGroup                        → Fieldset + Checkbox[]
 *   radio                               → Fieldset + Radio[]
 *   date                                → DatePicker
 *   file                                → FileUpload
 *   range                               → Range
 *   hidden                              → Input type="hidden"
 */

import { defineType, defineField } from "sanity";

// Reusable option item for select / radio / checkboxGroup
const optionItem = {
  type: "object",
  name: "option",
  title: "Option",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      description: "Submitted with the form — no spaces, use hyphens",
      type: "slug",
      options: { source: "label" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "disabled",
      title: "Disabled",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value.current" },
  },
};

// Reusable option group for grouped selects
const optionGroup = {
  type: "object",
  name: "optionGroup",
  title: "Option Group",
  fields: [
    defineField({
      name: "label",
      title: "Group Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      of: [optionItem],
    }),
  ],
  preview: {
    select: { title: "label" },
  },
};

export const formFieldType = defineType({
  name: "formField",
  title: "Form Field",
  type: "object",
  groups: [
    { name: "field", title: "Field" },
    { name: "options", title: "Options" },
    { name: "validation", title: "Validation" },
    { name: "advanced", title: "Advanced" },
  ],
  fields: [
    // ─── Core identity ──────────────────────────────────────────────────────
    defineField({
      name: "fieldType",
      title: "Field Type",
      type: "string",
      group: "field",
      options: {
        list: [
          { title: "Text", value: "text" },
          { title: "Email", value: "email" },
          { title: "Phone", value: "phone" },
          { title: "Number", value: "number" },
          { title: "URL", value: "url" },
          { title: "Textarea", value: "textarea" },
          { title: "Select", value: "select" },
          { title: "Multi-Select", value: "multiselect" },
          { title: "Checkbox (single)", value: "checkbox" },
          { title: "Checkbox Group", value: "checkboxGroup" },
          { title: "Radio Group", value: "radio" },
          { title: "Date", value: "date" },
          { title: "File Upload", value: "file" },
          { title: "Range / Slider", value: "range" },
          { title: "Hidden", value: "hidden" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Field Name",
      description:
        "Used as the form data key — no spaces, use camelCase or hyphens",
      type: "slug",
      group: "field",
      options: { source: "label" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      group: "field",
      validation: (Rule) =>
        Rule.custom((val, ctx) => {
          const parent = ctx.parent as { fieldType?: string };
          if (parent?.fieldType !== "hidden" && !val)
            return "Label is required";
          return true;
        }),
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder",
      type: "string",
      group: "field",
      hidden: ({ parent }) =>
        [
          "checkbox",
          "checkboxGroup",
          "radio",
          "date",
          "file",
          "range",
          "hidden",
        ].includes(parent?.fieldType),
    }),
    defineField({
      name: "helperText",
      title: "Helper Text",
      description: "Displayed below the field",
      type: "string",
      group: "field",
      hidden: ({ parent }) => parent?.fieldType === "hidden",
    }),
    defineField({
      name: "defaultValue",
      title: "Default Value",
      type: "string",
      group: "field",
      hidden: ({ parent }) =>
        ["checkboxGroup", "radio", "date", "file", "range"].includes(
          parent?.fieldType,
        ),
    }),

    // ─── Options (select / multiselect / radio / checkboxGroup) ───────────
    defineField({
      name: "useOptionGroups",
      title: "Use Option Groups",
      description: "Organise options into labelled groups",
      type: "boolean",
      group: "options",
      initialValue: false,
      hidden: ({ parent }) =>
        !["select", "multiselect"].includes(parent?.fieldType),
    }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      group: "options",
      of: [optionItem],
      hidden: ({ parent }) => {
        const needsOptions = [
          "select",
          "multiselect",
          "radio",
          "checkboxGroup",
        ].includes(parent?.fieldType);
        return !needsOptions || parent?.useOptionGroups;
      },
    }),
    defineField({
      name: "optionGroups",
      title: "Option Groups",
      type: "array",
      group: "options",
      of: [optionGroup],
      hidden: ({ parent }) =>
        !["select", "multiselect"].includes(parent?.fieldType) ||
        !parent?.useOptionGroups,
    }),

    // ─── Textarea options ──────────────────────────────────────────────────
    defineField({
      name: "rows",
      title: "Rows",
      type: "number",
      group: "advanced",
      initialValue: 4,
      hidden: ({ parent }) => parent?.fieldType !== "textarea",
    }),
    defineField({
      name: "showCharCount",
      title: "Show Character Count",
      type: "boolean",
      group: "advanced",
      initialValue: false,
      hidden: ({ parent }) => parent?.fieldType !== "textarea",
    }),

    // ─── Range options ─────────────────────────────────────────────────────
    defineField({
      name: "rangeMin",
      title: "Min Value",
      type: "number",
      group: "advanced",
      initialValue: 0,
      hidden: ({ parent }) => parent?.fieldType !== "range",
    }),
    defineField({
      name: "rangeMax",
      title: "Max Value",
      type: "number",
      group: "advanced",
      initialValue: 100,
      hidden: ({ parent }) => parent?.fieldType !== "range",
    }),
    defineField({
      name: "rangeStep",
      title: "Step",
      type: "number",
      group: "advanced",
      initialValue: 1,
      hidden: ({ parent }) => parent?.fieldType !== "range",
    }),
    defineField({
      name: "rangeValuePrefix",
      title: "Value Prefix",
      description: "e.g. '$'",
      type: "string",
      group: "advanced",
      hidden: ({ parent }) => parent?.fieldType !== "range",
    }),
    defineField({
      name: "rangeValueSuffix",
      title: "Value Suffix",
      description: "e.g. '%'",
      type: "string",
      group: "advanced",
      hidden: ({ parent }) => parent?.fieldType !== "range",
    }),

    // ─── File upload options ───────────────────────────────────────────────
    defineField({
      name: "fileAccept",
      title: "Accepted File Types",
      description: "e.g. '.pdf,.docx,image/*'",
      type: "string",
      group: "advanced",
      hidden: ({ parent }) => parent?.fieldType !== "file",
    }),
    defineField({
      name: "fileMaxSizeMb",
      title: "Max File Size (MB)",
      type: "number",
      group: "advanced",
      hidden: ({ parent }) => parent?.fieldType !== "file",
    }),
    defineField({
      name: "fileMaxFiles",
      title: "Max Number of Files",
      type: "number",
      group: "advanced",
      initialValue: 1,
      hidden: ({ parent }) => parent?.fieldType !== "file",
    }),
    defineField({
      name: "fileMultiple",
      title: "Allow Multiple Files",
      type: "boolean",
      group: "advanced",
      initialValue: false,
      hidden: ({ parent }) => parent?.fieldType !== "file",
    }),

    // ─── Validation ────────────────────────────────────────────────────────
    defineField({
      name: "required",
      title: "Required",
      type: "boolean",
      group: "validation",
      initialValue: false,
    }),
    defineField({
      name: "minLength",
      title: "Min Length",
      type: "number",
      group: "validation",
      hidden: ({ parent }) =>
        !["text", "email", "phone", "url", "textarea"].includes(
          parent?.fieldType,
        ),
    }),
    defineField({
      name: "maxLength",
      title: "Max Length",
      type: "number",
      group: "validation",
      hidden: ({ parent }) =>
        !["text", "email", "phone", "url", "textarea"].includes(
          parent?.fieldType,
        ),
    }),
    defineField({
      name: "pattern",
      title: "Regex Pattern",
      description: "Validates the field value against this pattern",
      type: "string",
      group: "validation",
      hidden: ({ parent }) =>
        !["text", "email", "phone", "url"].includes(parent?.fieldType),
    }),
    defineField({
      name: "patternMessage",
      title: "Pattern Error Message",
      type: "string",
      group: "validation",
      hidden: ({ parent }) =>
        !["text", "email", "phone", "url"].includes(parent?.fieldType),
    }),

    // ─── Hidden field value ────────────────────────────────────────────────
    defineField({
      name: "hiddenValue",
      title: "Hidden Value",
      description: "Static value submitted with the form",
      type: "string",
      group: "advanced",
      hidden: ({ parent }) => parent?.fieldType !== "hidden",
    }),

    // ─── Layout ────────────────────────────────────────────────────────────
    defineField({
      name: "width",
      title: "Field Width",
      description: "How much of the form row this field occupies",
      type: "string",
      group: "advanced",
      options: {
        list: [
          { title: "Full width", value: "full" },
          { title: "Half width", value: "half" },
          { title: "One third", value: "third" },
        ],
        layout: "radio",
      },
      initialValue: "full",
    }),
  ],
  preview: {
    select: {
      label: "label",
      fieldType: "fieldType",
      name: "name.current",
    },
    prepare({ label, fieldType, name }) {
      const icons: Record<string, string> = {
        text: "T",
        email: "@",
        phone: "☎",
        number: "#",
        textarea: "¶",
        select: "▼",
        multiselect: "▼▼",
        checkbox: "☑",
        checkboxGroup: "☑☑",
        radio: "◉",
        date: "📅",
        file: "📎",
        range: "⟷",
        hidden: "—",
        url: "🔗",
      };
      return {
        title: label || name || "Untitled field",
        subtitle: fieldType ? `${icons[fieldType] ?? ""} ${fieldType}` : "",
      };
    },
  },
});

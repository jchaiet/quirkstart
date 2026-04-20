/**
 * formBlockType.ts
 *
 * Page builder block for forms.
 * Supports single and multi-step forms.
 * Submission can go to email, webhook, or both.
 */

import { defineType, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";
import { paddingOptionType } from "../styles/paddingOptionType";
import { backgroundOptionType } from "../styles/backgroundOptionType";
import { idField } from "../fields/idField";

export const formBlockType = defineType({
  name: "formBlock",
  title: "Form Block",
  type: "object",
  icon: EnvelopeIcon,
  groups: [
    { name: "form", title: "Form" },
    { name: "submission", title: "Submission" },
    { name: "messages", title: "Messages" },
    { name: "styles", title: "Styles" },
  ],
  fields: [
    idField,

    // ─── Heading ──────────────────────────────────────────────────────────
    defineField({
      name: "heading",
      type: "heading",
      title: "Heading",
      group: "form",
    }),

    // ─── Form layout ──────────────────────────────────────────────────────
    defineField({
      name: "layout",
      title: "Form Layout",
      type: "string",
      group: "form",
      options: {
        list: [
          { title: "Vertical (stacked)", value: "vertical" },
          { title: "Horizontal (label left)", value: "horizontal" },
        ],
        layout: "radio",
      },
      initialValue: "vertical",
    }),

    // ─── Max width ────────────────────────────────────────────────────────
    defineField({
      name: "maxWidth",
      title: "Form Width",
      type: "string",
      group: "form",
      options: {
        list: [
          { title: "Small (480px)", value: "sm" },
          { title: "Medium (640px)", value: "md" },
          { title: "Large (800px)", value: "lg" },
          { title: "Full width", value: "full" },
        ],
        layout: "radio",
      },
      initialValue: "md",
    }),

    // ─── Steps ────────────────────────────────────────────────────────────
    defineField({
      name: "steps",
      title: "Steps",
      description: "Add one step for a standard form, multiple for a wizard",
      type: "array",
      group: "form",
      of: [{ type: "formStep" }],
      validation: (Rule) => Rule.min(1).error("At least one step is required"),
    }),

    // ─── Submit button ────────────────────────────────────────────────────
    defineField({
      name: "submitLabel",
      title: "Submit Button Label",
      type: "string",
      group: "form",
      initialValue: "Submit",
    }),
    defineField({
      name: "nextLabel",
      title: "Next Step Button Label",
      type: "string",
      group: "form",
      initialValue: "Next",
      hidden: ({ parent }) => parent?.steps?.length <= 1,
    }),
    defineField({
      name: "backLabel",
      title: "Back Button Label",
      type: "string",
      group: "form",
      initialValue: "Back",
      hidden: ({ parent }) => parent?.steps?.length <= 1,
    }),

    // ─── Submission ───────────────────────────────────────────────────────
    defineField({
      name: "submissionType",
      title: "Submission Type",
      type: "string",
      group: "submission",
      options: {
        list: [
          { title: "Email", value: "email" },
          { title: "Webhook", value: "webhook" },
          { title: "Both", value: "both" },
        ],
        layout: "radio",
      },
      initialValue: "email",
      validation: (Rule) => Rule.required(),
    }),

    // Email settings
    defineField({
      name: "emailTo",
      title: "Send To Email",
      type: "string",
      group: "submission",
      hidden: ({ parent }) =>
        !["email", "both"].includes(parent?.submissionType),
      validation: (Rule) =>
        Rule.custom((val, ctx) => {
          const parent = ctx.parent as { submissionType?: string };
          if (
            ["email", "both"].includes(parent?.submissionType ?? "") &&
            !val
          ) {
            return "Email address is required";
          }
          return true;
        }),
    }),
    defineField({
      name: "emailSubject",
      title: "Email Subject",
      type: "string",
      group: "submission",
      initialValue: "New form submission",
      hidden: ({ parent }) =>
        !["email", "both"].includes(parent?.submissionType),
    }),
    defineField({
      name: "replyTo",
      title: "Reply-To Field",
      description: "Name of an email field in the form to use as reply-to",
      type: "string",
      group: "submission",
      hidden: ({ parent }) =>
        !["email", "both"].includes(parent?.submissionType),
    }),

    // Webhook settings
    defineField({
      name: "webhookUrl",
      title: "Webhook URL",
      type: "url",
      group: "submission",
      hidden: ({ parent }) =>
        !["webhook", "both"].includes(parent?.submissionType),
      validation: (Rule) =>
        Rule.custom((val, ctx) => {
          const parent = ctx.parent as { submissionType?: string };
          if (
            ["webhook", "both"].includes(parent?.submissionType ?? "") &&
            !val
          ) {
            return "Webhook URL is required";
          }
          return true;
        }),
    }),
    defineField({
      name: "webhookSecret",
      title: "Webhook Secret",
      description: "Sent as X-Webhook-Secret header for verification",
      type: "string",
      group: "submission",
      hidden: ({ parent }) =>
        !["webhook", "both"].includes(parent?.submissionType),
    }),

    // ─── Messages ─────────────────────────────────────────────────────────
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "text",
      group: "messages",
      rows: 2,
      initialValue: "Thank you! Your submission has been received.",
    }),
    defineField({
      name: "errorMessage",
      title: "Error Message",
      type: "text",
      group: "messages",
      rows: 2,
      initialValue: "Something went wrong. Please try again.",
    }),
    defineField({
      name: "successRedirect",
      title: "Redirect After Success",
      description:
        "Optional: redirect to a page instead of showing the success message",
      type: "reference",
      to: [{ type: "page" }],
      group: "messages",
    }),

    // ─── Style options ────────────────────────────────────────────────────
    defineField({
      name: "styleOptions",
      title: "Style Options",
      type: "object",
      group: "styles",
      options: { collapsible: true, collapsed: false },
      groups: [
        { name: "padding", title: "Padding" },
        { name: "background", title: "Background" },
      ],
      fields: [...paddingOptionType, ...backgroundOptionType],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      steps: "steps",
      submissionType: "submissionType",
    },
    prepare({ title, steps, submissionType }) {
      const stepCount = steps?.length ?? 0;
      return {
        title: "Form Block",
        subtitle: `${stepCount} step${stepCount === 1 ? "" : "s"} · ${submissionType ?? "email"}`,
        media: EnvelopeIcon,
      };
    },
  },
});

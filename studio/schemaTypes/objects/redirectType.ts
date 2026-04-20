import { LeaveIcon } from "@sanity/icons";
import { defineType, defineField, type SlugValue, type SlugRule } from "sanity";

const slugValidator = (rule: SlugRule) =>
  rule.required().custom((value: SlugValue | undefined) => {
    if (!value || !value.current) return "Can't be blank";
    if (!value.current.startsWith("/")) {
      return "The path must start with a '/'";
    }
    return true;
  });

export const redirectType = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  description: "Redirects for next.config.js",
  icon: LeaveIcon,
  fields: [
    defineField({
      name: "source",
      type: "slug",
      title: "Source Path",
      validation: (rule: SlugRule) =>
        slugValidator(rule).custom(async (value, context) => {
          if (!value?.current) return true;
          const client = context.getClient({ apiVersion: "2024-01-01" });
          const count = await client.fetch<number>(
            `count(*[_type == "redirect" && source.current == $slug && _id != $id])`,
            {
              slug: value.current,
              id: context.document?._id ?? "",
            },
          );
          return count === 0
            ? true
            : "A redirect from this path already exists";
        }),
    }),
    defineField({
      name: "destinationPage",
      type: "reference",
      title: "Destination Page",
      to: [{ type: "page" }],
      description: "If set, will redirect to this page",
    }),
    defineField({
      name: "destinationSlug",
      type: "slug",
      title: "Destination Path",
      validation: (rule: SlugRule) =>
        rule.custom((value, context) => {
          const hasPage = (context.parent as any)?.destinationPage;
          if (!hasPage && (!value || !value.current)) {
            return "Must provide either a page or destination path";
          }

          if (value && value.current) {
            if (
              !value.current.startsWith("/") &&
              !value.current.startsWith("http://") &&
              !value.current.startsWith("https://")
            ) {
              return "The path must start with a '/' or 'http://' or 'https://";
            }
          }

          return true;
        }),
    }),
    defineField({
      name: "permanent",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      source: "source",
    },
    prepare({ source }) {
      return {
        title: source.current,
      };
    },
  },
});

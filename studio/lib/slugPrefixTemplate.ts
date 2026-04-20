import { Template } from "sanity";

export const slugPrefixTpl = (
  schemaType: string,
  title?: string
): Template<any, any> => {
  return {
    id: `${schemaType}-with-initial-slug`,
    title: title || `create new ${schemaType}`,
    schemaType: schemaType,
    parameters: [
      { name: "parentId", title: "Parent ID", type: "string" },
      { name: "parentSlug", title: "Parent Slug", type: "string" },
      { name: "siteId", title: "Site ID", type: "string" },
    ],
    value: ({
      parentId,
      parentSlug,
      siteId,
    }: {
      parentId?: string;
      parentSlug?: string;
      siteId?: string;
    }) => {
      const parentRef = parentId
        ? { _type: "reference", _ref: parentId }
        : undefined;

      const slug = parentSlug
        ? { _type: "slug", current: parentSlug + "/" }
        : undefined;

      const siteRef = siteId ? { _type: "reference", _ref: siteId } : undefined;

      return {
        parent: parentRef,
        slug: slug,
        site: siteRef,
      };
    },
  };
};

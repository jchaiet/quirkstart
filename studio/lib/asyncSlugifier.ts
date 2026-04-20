import { SlugifierFn } from "sanity";
import { client } from "./client";

export const asyncSlugifier: SlugifierFn = async (
  input: string,
  context: any,
) => {
  const page = context.parent;

  const parentQuery = `*[_id == $id][0]`;
  const parentQueryParams = {
    id: page?.parent?._ref || "",
  };

  const parent = await client.fetch(parentQuery, parentQueryParams);

  const parentSlug = parent?.slug?.current ? `${parent.slug.current}/` : "";

  const pageSlug = input
    ?.toLocaleLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 200);

  return `${parentSlug}${pageSlug}`;
};

export default asyncSlugifier;

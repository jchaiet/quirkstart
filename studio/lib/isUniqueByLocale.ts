/**
 * Locale-aware slug uniqueness check for Sanity
 *
 * Allows different locales to share the same slug
 * while preventing duplicates within the same locale
 */

import { SlugValidationContext } from "sanity";

interface SiteReference {
  _ref: string;
}

export const isUniqueByLocale = async (
  slug: string | undefined,
  context: SlugValidationContext
): Promise<boolean> => {
  const { document, getClient } = context;

  const locale = typeof document?.locale === "string" ? document.locale : null;
  const siteRef =
    typeof (document as any)?.site?._ref === "string"
      ? (document?.site as SiteReference)?._ref
      : null;

  if (!locale || !siteRef) return true;

  const client = getClient({ apiVersion: "2025-02-19" });

  const id = (document?._id || "").replace(/^drafts\./, "");

  const params = {
    id,
    locale,
    siteRef,
    slug,
  };
  const query = `
    !defined(
      *[
        !(sanity::versionOf($id)) &&
        slug.current == $slug &&
        locale == $locale &&
        site._ref == $siteRef
      ][0]._id
    )
  `;

  const result = await client.fetch(query, params);
  return Boolean(result);
};

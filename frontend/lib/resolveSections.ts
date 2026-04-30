import { urlForImage, sanityClient } from "@/sanity/client";
import type { PageSection, SanityImage, SanityCategory } from "quirk-ui/sanity";
import { documentListQuery } from "@/sanity/queries/fragments";
import { remark } from "remark";
import remarkGfm from "remark-gfm";

export type ResolveSectionOptions = {
  locale?: string;
  site: string;
  isDraft?: boolean;
  categoryOverride?: string[] | undefined;
  /** The _id of the current page — used to exclude it from document list queries */
  currentId?: string;
};

export function resolveImagesDeep<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(resolveImagesDeep) as unknown as T;
  }

  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const clone = { ...(obj as Record<string, unknown>) };

    //Handle imageWithLayout objects (defaultImage/darkImage pair)
    if ("defaultImage" in obj || "darkImage" in obj) {
      const image = (obj as SanityImage).defaultImage;
      const dark = (obj as SanityImage).darkImage ?? image;

      if (image?.asset?._id) {
        clone.imageUrl = urlForImage(image).width(1200).quality(90).url();
        clone.imageUrls = {
          default: {
            small: urlForImage(image).width(300).quality(90).url(),
            medium: urlForImage(image).width(600).quality(90).url(),
            large: urlForImage(image).width(1200).quality(90).url(),
          },
          dark: {
            small: urlForImage(dark).width(300).quality(90).url(),
            medium: urlForImage(dark).width(600).quality(90).url(),
            large: urlForImage(dark).width(1200).quality(90).url(),
          },
        };
      }
    }

    // Handle plain Sanity image objects (e.g. featuredImage on articles)
    // These have { asset: { _id, _type } } but no defaultImage wrapper.
    // BlogArticleCard expects SanityImage with imageUrls, so we resolve
    // them into the same imageWithLayout shape with a synthetic defaultImage.
    type SimpleSanityImage = { asset: { _id: string; _type: string } };

    const asPlainImage = obj as unknown as SimpleSanityImage;
    if (
      !("defaultImage" in obj) &&
      !("darkImage" in obj) &&
      "asset" in obj &&
      asPlainImage.asset?._id &&
      !("imageUrls" in clone)
    ) {
      clone.defaultImage = { asset: asPlainImage.asset };
      clone.imageUrls = {
        default: {
          small: urlForImage(asPlainImage).width(300).quality(90).url(),
          medium: urlForImage(asPlainImage).width(600).quality(90).url(),
          large: urlForImage(asPlainImage).width(1200).quality(90).url(),
        },
        dark: {
          small: urlForImage(asPlainImage).width(300).quality(90).url(),
          medium: urlForImage(asPlainImage).width(600).quality(90).url(),
          large: urlForImage(asPlainImage).width(1200).quality(90).url(),
        },
      };
    }

    //Legacy images
    // if (isSanityImage(obj)) {
    //   clone.imageUrl = urlForImage(obj).width(1200).quality(90).url();
    //   clone.imageUrls = {
    //     small: urlForImage(obj).width(300).quality(90).url(),
    //     medium: urlForImage(obj).width(600).quality(90).url(),
    //     large: urlForImage(obj).width(1200).quality(90).url(),
    //   };
    // }

    for (const [key, value] of Object.entries(obj)) {
      clone[key] = resolveImagesDeep(value);
    }

    return clone as T;
  }

  return obj;
}

function normalizeCategoryFilters(filters: SanityCategory[]): string[] {
  if (!filters) return [];

  return filters.map((f) => (typeof f === "string" ? f : f._id));
}

export function resolveSections(
  sections: PageSection[],
  { locale, site, isDraft, categoryOverride, currentId }: ResolveSectionOptions,
): Promise<PageSection[]> {
  return Promise.all(
    sections.map(async (section) => {
      let resolved = resolveImagesDeep(section);

      if (section._type === "documentListBlock") {
        try {
          const baseInclude = normalizeCategoryFilters(
            section.includeFilters ?? [],
          );
          const excludeCategories = normalizeCategoryFilters(
            section.excludeFilters ?? [],
          );

          const includeCategories =
            categoryOverride && categoryOverride?.length > 0
              ? [...baseInclude, ...categoryOverride]
              : baseInclude;

          // parentPage ref — used when documentType is "page" to list siblings
          const parentRef = (
            section as PageSection & {
              parentPage?: { _ref: string };
            }
          ).parentPage?._ref;

          const result = await sanityClient.fetch(
            documentListQuery,
            {
              locale,
              site,
              // Pass null when empty — GROQ null checks ($x == null) require
              // the param to always be present, unlike !defined() which errors
              // if the param is missing entirely
              excludeCategories:
                excludeCategories.length > 0 ? excludeCategories : null,
              includeCategories:
                includeCategories.length > 0 ? includeCategories : null,
              parentRef: parentRef ?? null,
              currentId: currentId ?? "",
              limit: section.limit ?? 3,
              documentType: section.documentType,
            },
            isDraft
              ? { perspective: "drafts", useCdn: false, stega: true }
              : undefined,
          );

          const resolvedInitialDocuments = resolveImagesDeep(result.documents);

          resolved = {
            ...resolved,
            initialDocuments: resolvedInitialDocuments,
            initialTotalCount: result.count,
            initialIncludeCategories: includeCategories,
            initialExcludeCategories: excludeCategories,
            parentPage: section.parentPage ?? null,
          };
        } catch (err) {
          console.error("Failed to fetch document list for section", err);
        }
      }

      // ── Markdown block — process to HTML server-side ─────────────────────
      // Converts markdown string to HTML before reaching the client PageBuilder.
      // MarkdownBlock receives processedHtml and renders it synchronously.
      if (section._type === "markdownBlock") {
        const markdownSection = section as PageSection & {
          content?: { code?: string };
        };
        const markdownString = markdownSection.content?.code ?? "";
        if (markdownString) {
          const result = await remark().use(remarkGfm).process(markdownString);
          resolved = { ...resolved, processedHtml: result.toString() };
        }
      }

      return resolved;
    }),
  );
}

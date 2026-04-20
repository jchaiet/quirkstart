/**
 * deskStructure.ts
 *
 * Changes from original:
 *  - Locales extracted to lib/siteConfig.ts (single source of truth)
 *  - Repetitive site/locale/parentChild pattern extracted to `siteContentList`
 *  - Removed commented-out dead code
 */

import {
  StructureBuilder,
  StructureResolverContext,
  structureTool,
  DefaultDocumentNodeResolver,
} from "sanity/structure";
import {
  ControlsIcon,
  DocumentsIcon,
  LeaveIcon,
  SunIcon,
  TagsIcon,
} from "@sanity/icons";
import parentChild from "./lib/parentChild";
import { client } from "./lib/client";
import { LOCALES } from "./lib/siteConfig";

// ─── Default document node ─────────────────────────────────────────────────────

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S: StructureBuilder,
  context,
) => {
  if (context.schemaType === "page") {
    return S.document().views([S.view.form()]);
  }
  return S.document();
};

// ─── Helper: build a site → locale → parentChild list ─────────────────────────

function siteContentList(
  S: StructureBuilder,
  context: StructureResolverContext,
  sites: { _id: string; title: string }[],
  opts: {
    title: string;
    schemaType: "page" | "blog";
    idPrefix: string;
  },
) {
  return S.listItem()
    .title(opts.title)
    .child(
      S.list()
        .title(opts.title)
        .items(
          sites.map((site) =>
            S.listItem()
              .title(site.title)
              .id(`site-${opts.idPrefix}-${site._id}`)
              .child(
                S.list()
                  .title(`${site.title} ${opts.title}`)
                  .id(`${opts.idPrefix}-by-site-${site._id}`)
                  .items(
                    LOCALES.map((locale) =>
                      parentChild(
                        opts.schemaType,
                        `${opts.title} (${locale.title})`,
                        DocumentsIcon,
                        S,
                        context.documentStore,
                        `${locale.filter} && site._ref == "${site._id}"`,
                        site._id,
                      ).id(`${opts.idPrefix}-${site._id}-${locale.id}`),
                    ),
                  ),
              ),
          ),
        ),
    );
}

// ─── Desk structure ────────────────────────────────────────────────────────────

export const deskContent = structureTool({
  name: "content",
  title: "Content",
  defaultDocumentNode,
  structure: async (S: StructureBuilder, context: StructureResolverContext) => {
    const sites = (await client.fetch('*[_type == "site"]')) as {
      _id: string;
      title: string;
    }[];

    return S.list()
      .title("Content")
      .id("content")
      .items([
        S.listItem()
          .title("Sites")
          .icon(ControlsIcon)
          .child(S.documentTypeList("site").title("Sites")),

        S.divider(),

        siteContentList(S, context, sites, {
          title: "Pages by Site",
          schemaType: "page",
          idPrefix: "pages",
        }),

        siteContentList(S, context, sites, {
          title: "Articles by Site",
          schemaType: "blog",
          idPrefix: "articles",
        }),

        S.divider(),

        S.documentTypeListItem("navigation").title("Navigation"),

        S.listItem()
          .title("Categories by Site")
          .child(
            S.list()
              .title("Categories by Site")
              .items(
                sites.map((site) =>
                  parentChild(
                    "category",
                    site.title,
                    TagsIcon,
                    S,
                    context.documentStore,
                    `site._ref == "${site._id}"`,
                    site._id,
                  ).id(`categories-${site._id}`),
                ),
              ),
          ),

        parentChild(
          "singleton",
          "Singletons",
          SunIcon,
          S,
          context.documentStore,
        ),

        S.documentTypeListItem("redirect").title("Redirects").icon(LeaveIcon),
      ]);
  },
});

import { DocumentStore, ListenQueryOptions, SanityDocument } from "sanity";
import { ItemChild, ListBuilder, StructureBuilder } from "sanity/structure";
import { Observable } from "rxjs";
import { map, switchMap, distinctUntilChanged } from "rxjs/operators";
import isEqual from "fast-deep-equal";
import { AddIcon, FolderIcon, EditIcon } from "@sanity/icons";
import { viewsWithPreview } from "./viewsWithPreview";

export default function parentChild(
  schemaType: string = "page",
  title: string = "Pages",
  icon: React.ComponentType = FolderIcon,
  S: StructureBuilder,
  documentStore: DocumentStore,
  customFilter?: string,
  siteId?: string
) {
  const appendFilter = (base: string) =>
    customFilter ? `${base} && (${customFilter})` : base;

  const siteFilter = siteId ? `site._ref == "${siteId}"` : "";

  const filterWithoutParent = appendFilter(
    `_type == "${schemaType}" && !defined(parent) && !(_id in path("drafts.**")) ${siteFilter ? `&& ${siteFilter}` : ""}`
  );

  const filterAll = appendFilter(
    `_type == "${schemaType}" && !(_id in path("drafts.**")) ${siteFilter ? `&& ${siteFilter}` : ""}`
  );

  const query = `*[${filterWithoutParent}]{ _id, title, slug }`;
  const queryId = (id: string) =>
    `*[${filterAll} && _id == "${id}"][0]{ _id, title, slug, parent, children }`;
  const queryGetChildren = (id: string, schemaType: string) =>
    `*[_type == "${schemaType}" && site._ref == "${siteId}" && (_id == "${id}" || parent._ref == "${id}") && !(_id in path("drafts.**"))]{ _id, title, slug, parent, children }`;

  const options: ListenQueryOptions = { apiVersion: `2023-01-01` };

  const getChildrenFn = (
    id: string,
    S: StructureBuilder,
    fn: any
  ): Observable<ListBuilder | ItemChild> => {
    return documentStore
      .listenQuery(queryGetChildren(id, schemaType), {}, options)
      .pipe(
        distinctUntilChanged(isEqual),
        switchMap((children) => {
          return documentStore.listenQuery(queryId(id), {}, options).pipe(
            distinctUntilChanged(isEqual),
            map((parent) => {
              return S.list()
                .menuItems([
                  parent &&
                    S.menuItem()
                      .title(`Create new ${schemaType}`)
                      .icon(AddIcon)
                      .intent({
                        type: "create",
                        params: [
                          {
                            type: schemaType,
                            template: `${schemaType}-with-initial-slug`,
                          },
                          {
                            parentId: parent?._id,
                            parentSlug: parent?.slug?.current,
                            siteId: siteId,
                          },
                        ],
                      }),
                ])
                .title(parent.title)
                .items([
                  parent?._id === id &&
                    S.listItem()
                      .id(parent._id)
                      .title(parent.title)
                      .icon(EditIcon)
                      .child(
                        S.document()
                          .documentId(parent._id)
                          .schemaType(schemaType)
                          .views(viewsWithPreview(S))
                      ),
                  S.divider(),

                  ...children
                    .filter(({ _id }: { _id: string }) => id !== _id)
                    .map((child: any) => {
                      return S.listItem()
                        .id(child._id)
                        .title(child.title)
                        .icon(FolderIcon)
                        .showIcon(true)
                        .schemaType(schemaType)
                        .child((_id) => fn(_id, S, fn));
                    }),
                ]);
            })
          );
        })
      );
  };

  return S.listItem()
    .title(title)
    .icon(icon)
    .child(() =>
      documentStore.listenQuery(query, {}, options).pipe(
        distinctUntilChanged(isEqual),
        map((parents) =>
          S.list()
            .title(title)
            .menuItems([
              S.menuItem()
                .title("Add")
                .icon(AddIcon)
                .intent({
                  type: "create",
                  params: [
                    {
                      type: schemaType,
                      template: `${schemaType}-with-initial-slug`,
                    },
                    {
                      siteId: siteId,
                    },
                  ],
                }),
            ])
            .items([
              //Create a List Item for all documents
              S.listItem()
                .title("All")
                .schemaType(schemaType)
                .child(() =>
                  S.documentList()
                    .schemaType(schemaType)
                    .title("All")
                    .apiVersion(`2023-01-01`)
                    .filter(filterAll)
                    //Use this list for displaying from search results
                    .canHandleIntent(
                      (intentName, params) =>
                        intentName === "edit" && params.type === schemaType
                    )
                    .child((id) =>
                      S.document()
                        .documentId(id)
                        .schemaType(schemaType)
                        .views(viewsWithPreview(S))
                    )
                ),
              S.divider(),

              ...parents.map((parent: SanityDocument) => {
                return S.listItem()
                  .id(parent._id)
                  .title(parent.title as string)
                  .schemaType(schemaType)
                  .child((id) => getChildrenFn(id, S, getChildrenFn));
              }),
            ])
        )
      )
    );
}

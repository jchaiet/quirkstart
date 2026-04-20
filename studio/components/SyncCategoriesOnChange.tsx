import React, { useEffect, useRef } from "react";
import { useClient, useDocumentOperation, useDocumentValues } from "sanity";

interface SyncCategoriesProps {
  id: string;
  currentCategories?: any[];
  currentPageBuilder?: any[];
  draft?: any;
  published?: any;
}

export function SyncCategoriesOnChange({
  id,
  currentCategories,
  currentPageBuilder,
  draft,
  published,
}: SyncCategoriesProps) {
  const client = useClient({ apiVersion: "2023-01-01" });

  useEffect(() => {
    if (!currentCategories) return;

    const docToUpdate = draft || published;
    if (!docToUpdate) return;

    const pageBuilderToCompare = currentPageBuilder || [];

    const featuredBlock = pageBuilderToCompare.find(
      (block: any) => block._type === "featuredDocumentsBlock"
    );

    if (!featuredBlock) return;

    const currentFilters = featuredBlock.includeFilters || [];

    const currentFilterIds = currentFilters
      .map((c: any) => c._ref || c._id)
      .sort();

    const newCategoryIds = (currentCategories as any[])
      .map((c: any) => c._ref || c._id)
      .sort();

    const areEqual =
      currentFilterIds.length === newCategoryIds.length &&
      currentFilterIds.every(
        (id: string, idx: number) => id === newCategoryIds[idx]
      );

    if (areEqual) return;

    const basePageBuilderForPatch = docToUpdate.pageBuilder || [];
    const updatedPageBuilder = basePageBuilderForPatch.map((block: any) => {
      if (block._type === "featuredDocumentsBlock") {
        return { ...block, includeFilters: currentCategories };
      }
      return block;
    });

    async function patchDoc() {
      try {
        await client
          .patch(docToUpdate._id)
          .set({ pageBuilder: updatedPageBuilder })
          .commit();
      } catch (err) {
        console.error("Failed to sync categories:", err);
      }
    }

    patchDoc();
  }, [currentCategories, currentPageBuilder, draft, published, client, id]);

  // useEffect(() => {
  //   if (isLoading) return;
  //   if (!value) return;
  //   if (!value.categories) return;

  //   const categories = value.categories;
  //   const doc = draft || published;
  //   if (!doc) return;

  //   //Check for changes
  //   const pageBuilder = doc.pageBuilder || [];

  //   const featuredBlock = pageBuilder.find(
  //     (block: any) => block._type === "featuredDocumentsBlock"
  //   );

  //   const currentFilters = featuredBlock?.includeFilters || [];

  //   const currentIds = currentFilters.map((c: any) => c._ref || c._id).sort();
  //   const newIds = (categories as any[])
  //     .map((c: any) => c._ref || c._id)
  //     .sort();

  //   const areEqual =
  //     currentIds.length === newIds.length &&
  //     currentIds.every((id: string, idx: number) => id === newIds[idx]);

  //   if (areEqual) {
  //     return;
  //   }

  //   const updatePageBuilder = (doc.pageBuilder || []).map((block: any) => {
  //     if (block._type === "featuredDocumentsBlock") {
  //       return { ...block, includeFilters: categories };
  //     }

  //     return block;
  //   });

  //   async function patchDoc() {
  //     try {
  //       await client
  //         .patch(doc._id)
  //         .set({ pageBuilder: updatePageBuilder })
  //         .commit();
  //     } catch (err) {
  //       console.error("Failed to sync categories:", err);
  //     }
  //   }

  //   //patchDoc();
  // }, [value, isLoading, draft, published, client]);

  return null;
}

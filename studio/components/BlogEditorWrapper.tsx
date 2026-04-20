/* 
Used in conjuntion with SyncedCategoriesOnChanges
Issues: Could not edit featuredDocumentsBlock IncludeFilters
*/
import React, { useEffect, useState } from "react";
import { SyncCategoriesOnChange } from "./SyncCategoriesOnChange";
import { useClient, useDocumentValues } from "sanity";

export function BlogEditorWrapper(props: any) {
  const { value, renderDefault } = props;

  const client = useClient({ apiVersion: "2023-01-01" });

  const [draftDoc, setDraftDoc] = useState(null);
  const [publishedDoc, setPublishedDoc] = useState(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  const { value: currentDocValue, isLoading: isLoadingCurrentDoc } =
    useDocumentValues(value?._id, ["categories", "pageBuilder"]);

  const isDraft = value?._id?.startsWith("drafts.");
  const publishedId = isDraft ? value._id.replace("drafts.", "") : value?._id;
  const draftId = isDraft ? value._id : `drafts.${value?._id}`;

  useEffect(() => {
    let isMounted = true;

    const fetchDocuments = async () => {
      if (!value._id) {
        setIsLoadingDocs(false);
        return;
      }

      setIsLoadingDocs(true);

      try {
        const fetchedPublishedDoc = await client.fetch(`*[_id == $id][0]`, {
          id: publishedId,
        });
        if (isMounted) {
          setPublishedDoc(fetchedPublishedDoc);
        }
        const fetchedDraftDoc = await client.fetch(`*[_id == $id][0]`, {
          id: draftId,
        });
        if (isMounted) {
          setDraftDoc(fetchedDraftDoc);
        }
      } catch (err) {
        console.error("Error fetching document version:", err);
      } finally {
        if (isMounted) {
          setIsLoadingDocs(false);
        }
      }
    };

    fetchDocuments();

    return () => {
      isMounted = false;
    };
  }, [value?._id, client, publishedId, draftId]);

  if (isLoadingDocs || isLoadingCurrentDoc) {
    return <div>Loading document versions...</div>;
  }

  return (
    <>
      <SyncCategoriesOnChange
        id={value?._id}
        currentCategories={currentDocValue?.categories as any[] | undefined}
        currentPageBuilder={currentDocValue?.pageBuilder as any[] | undefined}
        draft={draftDoc}
        published={publishedDoc}
      />
      {renderDefault(props)}
    </>
  );
}

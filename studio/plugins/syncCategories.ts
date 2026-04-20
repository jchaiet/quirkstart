import { SyncIcon } from "@sanity/icons";
import { DocumentActionProps } from "sanity";
import { useClient } from "sanity";

export const SyncCategories = (props: DocumentActionProps) => {
  const client = useClient({ apiVersion: "2023-01-01" });
  const { draft, published, onComplete } = props;
  const doc = draft || published;

  if (!doc || doc._type !== "blog") return null;

  return {
    label: "Sync Categories to Featured Blocks",
    icon: SyncIcon,
    onHandle: async () => {
      const categories = doc.categories || [];

      const updatedPageBuilder = ((doc.pageBuilder as any[]) || []).map(
        (block: any) => {
          if (block._type === "featuredDocumentsBlock") {
            return {
              ...block,
              includeFilters: categories,
            };
          }
          return block;
        }
      );

      try {
        await client
          .patch(doc._id)
          .set({ pageBuilder: updatedPageBuilder })
          .commit();

        onComplete();
      } catch (err) {
        console.error("Failed to sync categories: ", err);
        onComplete();
      }
    },
  };
};

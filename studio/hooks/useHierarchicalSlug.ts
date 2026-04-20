// src/hooks/useHierarchicalSlug.ts

import { useFormValue, useClient } from "sanity";
import { useMemo } from "react";

// Your custom sanitize function
const sanitize = (str: string): string =>
  str
    ? str
        .toLowerCase()
        .trim()
        .replace(/[^\w\-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

// Function signature for the hook
export const useHierarchicalSlug = (
  currentTitle: string | undefined
): [string, () => Promise<string>] => {
  // Access the parent reference field named 'parent' from the document
  const parentRef = useFormValue(["parent"]) as { _ref: string } | undefined;

  // Get the Sanity client instance
  const client = useClient({ apiVersion: "2024-05-14" });

  // Synchronously calculate the base slug segment
  const baseSlug = useMemo(() => sanitize(currentTitle || ""), [currentTitle]);

  // Define the core asynchronous function
  const generateSlug = async (): Promise<string> => {
    let finalSlug = baseSlug;

    if (parentRef?._ref) {
      const parentQuery = `*[_id == $id][0]{ 'parentSlug': slug.current }`;
      const parentQueryParams = { id: parentRef._ref };

      try {
        const parent = await client.fetch(parentQuery, parentQueryParams);
        const parentSlug: string | undefined = parent?.parentSlug;

        if (parentSlug) {
          finalSlug = `${parentSlug}/${baseSlug}`;
        }
      } catch (error) {
        console.error("Error fetching parent slug in custom component:", error);
      }
    }

    // Always return a string
    return finalSlug;
  };

  return [baseSlug, generateSlug];
};

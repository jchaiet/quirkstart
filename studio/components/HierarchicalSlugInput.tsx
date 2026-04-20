// src/components/HierarchicalSlugInput.tsx

import React, { useCallback, useEffect, useState } from "react";
import { Button, Box, TextInput, Card, Stack, Flex } from "@sanity/ui";
import {
  set,
  unset,
  useFormValue,
  ObjectInputProps,
  SlugValue,
  ObjectSchemaType,
} from "sanity";
import { useHierarchicalSlug } from "../hooks/useHierarchicalSlug";

type HierarchicalSlugInputProps = ObjectInputProps<SlugValue, ObjectSchemaType>;

const slugPrefixes: Record<string, string> = {
  blog: "blog/articles",
};

export const HierarchicalSlugInput: React.FC<HierarchicalSlugInputProps> = (
  props,
) => {
  const { onChange, value } = props as any;

  // Safely get the source field value (your 'title' field)
  const title = useFormValue(["title"]) as string | undefined;

  // Get the document _type so we can adjust the slug
  const docType = useFormValue(["_type"]) as string | undefined;

  // Use the custom hook to get the generation logic
  const [baseSlugSegment, generateSlug] = useHierarchicalSlug(title);

  // Local state for the slug value
  const [currentSlug, setCurrentSlug] = useState(value?.current || "");

  // Synchronize local state with form state
  useEffect(() => {
    if (value?.current && value.current !== currentSlug) {
      setCurrentSlug(value.current);
    }
  }, [value?.current, currentSlug]);

  // Handle manual input changes
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value.replace(/^\/+/, "");
      setCurrentSlug(newValue);

      if (newValue) {
        onChange(set({ _type: "slug", current: newValue }));
      } else {
        onChange(unset());
      }
    },
    [onChange],
  );

  // Handle the "Generate Slug" button click (Async Logic)
  const handleGenerate = useCallback(async () => {
    const finalSlug = await generateSlug();

    setCurrentSlug(finalSlug);
    onChange(set({ _type: "slug", current: finalSlug }));
  }, [generateSlug, onChange]);

  const displaySlug = currentSlug || baseSlugSegment || "";

  return (
    <Stack>
      <Flex style={{ width: "100%" }}>
        <Box style={{ display: "flex", width: "100%" }}>
          <Card style={{ width: "100%" }}>
            <TextInput
              id="slug-input-id"
              value={displaySlug}
              onChange={handleChange}
            />
          </Card>
          <Button
            text="Generate"
            mode="ghost"
            onClick={handleGenerate}
            disabled={!title}
            style={{ marginLeft: "8px" }}
          />
        </Box>
      </Flex>
    </Stack>
  );
};

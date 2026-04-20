import { useEffect, useRef } from "react";
import { ObjectInputProps, useFormValue, set } from "sanity";

export function SyncedImageInput(props: ObjectInputProps) {
  const { value, onChange, path } = props;

  const featuredImage = useFormValue(["featuredImage"]);
  const docType = useFormValue(["_type"]);

  const parentBlockType = useFormValue([...path.slice(0, -1), "_type"]) as
    | string
    | undefined;

  const isTarget =
    docType === "blog" &&
    parentBlockType === "heroBlock" &&
    path[path.length - 1] === "image";

  // Track whether the editor has manually cleared the image.
  // Once cleared intentionally, we stop re-syncing from featuredImage
  // so the editor's choice is respected.
  const wasManuallyCleared = useRef(false);

  const hasAsset = !!(value as any)?.defaultImage?.asset?._ref;
  const prevHasAsset = useRef(hasAsset);

  // Detect manual clear: value had an asset, now it doesn't
  useEffect(() => {
    if (prevHasAsset.current && !hasAsset) {
      wasManuallyCleared.current = true;
    }
    prevHasAsset.current = hasAsset;
  }, [hasAsset]);

  // Sync featuredImage → hero image when:
  // - This is the target field
  // - No asset is currently set
  // - Editor hasn't manually cleared it
  // - featuredImage has data
  useEffect(() => {
    if (
      !isTarget ||
      hasAsset ||
      wasManuallyCleared.current ||
      !featuredImage ||
      typeof featuredImage !== "object"
    ) {
      return;
    }

    const imageWithLayout = {
      _type: "imageWithLayout",
      defaultImage: (featuredImage as any).defaultImage ?? featuredImage,
      layout: "cover",
      position: "center",
      sizing: "full",
    };

    onChange(set(imageWithLayout));
  }, [isTarget, hasAsset, featuredImage, onChange]);

  return props.renderDefault(props);
}

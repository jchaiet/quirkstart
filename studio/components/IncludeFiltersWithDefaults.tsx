import { useEffect } from "react";
import {
  set,
  ArrayOfObjectsInput,
  ArrayOfObjectsInputProps,
  PatchEvent,
  useFormValue,
} from "sanity";

export default function IncludeFiltersWithDefaults(
  props: ArrayOfObjectsInputProps
) {
  const { value, onChange } = props;
  const categories = useFormValue(["categories"]) as
    | { _ref?: string; _id?: string; _key?: string }[]
    | undefined;

  useEffect(() => {
    if ((!value || value.length === 0) && categories?.length) {
      const defaultValue = categories.map((cat) => ({
        _type: "reference",
        _ref: cat._ref || cat._id,
        _key: cat._key,
      }));

      onChange(PatchEvent.from(set(defaultValue)));
    }
  }, [categories, value, onChange]);

  return <ArrayOfObjectsInput {...props} />;
}

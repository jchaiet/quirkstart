import { useFormValue, set, type ObjectInputProps } from "sanity";
import { useEffect } from "react";

export function SyncedRichTextInput(props: ObjectInputProps) {
  const { value, onChange, path } = props;

  const blogTitle: string | undefined = useFormValue(["title"]) as string;
  const docType = useFormValue(["_type"]) as string;

  const parentBlockType = useFormValue([...path.slice(0, -2), "_type"]) as
    | string
    | undefined;

  useEffect(() => {
    if (
      docType === "blog" &&
      parentBlockType === "heroBlock" &&
      (!value || value.length === 0) &&
      blogTitle
    ) {
      const richTextBlock = [
        {
          _type: "block",
          _key: `title-${Math.random().toString(36).substring(2, 8)}`,
          style: "h1",
          markDefs: [],
          children: [
            {
              _type: "span",
              text: blogTitle,
              makes: [],
            },
          ],
        },
      ];

      onChange(set(richTextBlock));
    }
  }, [docType, blogTitle, value, onChange]);

  return props.renderDefault(props);
}

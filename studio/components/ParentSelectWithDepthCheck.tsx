import { useClient, useFormValue } from "sanity";
import { ReferenceInputProps } from "sanity";
import { useEffect, useState } from "react";

const MAX_DEPTH = 3;

export default function ParentSelectWithDepthCheck(props: ReferenceInputProps) {
  const client = useClient({ apiVersion: "2023-01-01" });
  const currentDocId = useFormValue(["_id"]) as string;

  const [error, setError] = useState<string | null>(null);

  async function getDepth(refId: string, depth = 1): Promise<number> {
    if (depth >= MAX_DEPTH) return depth;

    const parent = await client.fetch(`*[_id == $id][0]{parent}`, {
      id: refId,
    });

    if (parent?.parent?._ref) {
      return getDepth(parent.parent._ref, depth + 1);
    }

    return depth;
  }

  useEffect(() => {
    const ref = props.value?._ref;
    if (!ref) return setError(null);

    getDepth(ref).then((depth) => {
      if (depth >= MAX_DEPTH) {
        setError(`Too deep! Max depth of ${MAX_DEPTH} exceeded!`);
      } else {
        setError(null);
      }
    });
  }, [props.value]);

  return (
    <div>
      {props.renderDefault(props)}
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}

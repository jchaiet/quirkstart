import { useClient } from "sanity";
import { useEffect, useState } from "react";

type ChildPageListProps = {
  documentId: string;
};

export default function ChildPageList({ documentId }: ChildPageListProps) {
  const [children, setChildren] = useState<any[]>([]);
  const client = useClient({ apiVersion: "2023-01-01" });

  useEffect(() => {
    if (!documentId) return;

    const fetchChildren = async () => {
      const query = `*[_type == "page" && parent._ref == $parentId] | order(title asc)`;
      const result = await client.fetch(query, { parentId: documentId });
      setChildren(result);
    };

    fetchChildren();
  }, [documentId, client]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Subpages</h2>
      {children.length > 0 ? (
        <ul>
          {children.map((child) => (
            <li key={child._id}>{child.title}</li>
          ))}
        </ul>
      ) : (
        <p>No subpages</p>
      )}
    </div>
  );
}

/**
 * JsonLd.tsx
 *
 * Generic JSON-LD script injector.
 * Renders a <script type="application/ld+json"> tag server-side.
 * No client JS — pure HTML output.
 */

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

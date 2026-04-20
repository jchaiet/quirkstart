"use client";

/**
 * components/preview/DraftModeTools.tsx
 *
 * Client component wrapper for all draft mode / visual editing tools.
 * next/dynamic with ssr: false is only allowed in client components —
 * this wrapper exists solely to satisfy that constraint while keeping
 * layout.tsx as a server component.
 *
 * None of these dynamic imports will appear in production bundles
 * because the parent layout only renders this component when
 * !isProd && isEnabled (draft mode active).
 */

import dynamic from "next/dynamic";

const VisualEditing = dynamic(
  () => import("next-sanity").then((m) => ({ default: m.VisualEditing })),
  { ssr: false },
);

const SanityLiveVisualEditing = dynamic(
  () =>
    import("@/components/preview/SanityLiveVisualEditing").then((m) => ({
      default: m.SanityLiveVisualEditing,
    })),
  { ssr: false },
);

const DisableDraftMode = dynamic(
  () =>
    import("@/components/preview/DisableDraftMode").then((m) => ({
      default: m.DisableDraftMode,
    })),
  { ssr: false },
);

export function DraftModeTools() {
  return (
    <>
      <SanityLiveVisualEditing />
      <DisableDraftMode />
      <VisualEditing />
    </>
  );
}

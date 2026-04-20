"use client";

/**
 * SanityLiveVisualEditing.tsx
 *
 * Only renders inside the Sanity Studio iframe (visual editing context).
 * SanityLive is dynamically imported so the Sanity live/visual-editing
 * bundle is excluded from production pages entirely.
 *
 * Usage in layout.tsx — wrap in draft mode check:
 *   {isEnabled && <SanityLiveVisualEditing />}
 */

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Dynamically imported — keeps Sanity live bundle out of production client JS
const SanityLive = dynamic(
  () => import("@/sanity/live").then((m) => ({ default: m.SanityLive })),
  { ssr: false },
);

export function SanityLiveVisualEditing() {
  const [isInIframe, setIsInIframe] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsInIframe(window.parent !== window);
  }, []);

  useEffect(() => {
    if (isInIframe && window.parent.location.pathname !== pathname) {
      router.refresh();
    }
  }, [isInIframe, pathname, router]);

  if (!isInIframe) return null;

  return <SanityLive />;
}

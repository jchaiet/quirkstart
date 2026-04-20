"use client";

import { useEffect, useRef } from "react";
import { Announcement } from "quirk-ui/core";
import { renderRichText } from "quirk-ui/next";
import type { AnnouncementData } from "@/lib/resolveAnnouncement";

type AnnouncementBarProps = {
  announcement: AnnouncementData;
  isSticky?: boolean;
};

export function AnnouncementBar({
  announcement,
  isSticky,
}: AnnouncementBarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    // Set initial height immediately
    document.body.style.setProperty(
      "--announcement-height",
      `${el.offsetHeight}px`,
    );

    // Keep it in sync if the bar changes height (e.g. text reflows on resize)
    const observer = new ResizeObserver(([entry]) => {
      const height = entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight;
      document.body.style.setProperty("--announcement-height", `${height}px`);
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      // Clear when announcement unmounts (dismissed or no content)
      document.body.style.setProperty("--announcement-height", "0px");
    };
  }, []);

  if (!announcement?.content?.length) return null;

  return (
    <div
      ref={ref}
      style={
        isSticky
          ? { position: "fixed", top: 0, zIndex: 1001, width: "100%" }
          : undefined
      }
    >
      <Announcement
        blocks={announcement.content}
        renderRichText={renderRichText}
      />
    </div>
  );
}

/**
 * lib/resolveAnnouncement.ts
 *
 * Resolves which announcement to show for a given page by walking
 * the parent chain server-side.
 *
 * Priority:
 *  1. Page has its own announcement.content → use it
 *  2. Walk up parent chain — use nearest ancestor where
 *     announcement.content exists AND announcement.applyToChildren = true
 *  3. No announcement → return null
 *
 * GROQ dereferences up to 3 levels deep (grandparent → parent → page).
 * For deeper hierarchies, add more levels to the announcementFragment chain.
 */

import type { PortableTextBlock } from "@portabletext/types";

export type AnnouncementData = {
  content: PortableTextBlock[];
} | null;

type PageWithAnnouncement = {
  announcement?: {
    content?: PortableTextBlock[];
    applyToChildren?: boolean;
  };
  parent?: PageWithAnnouncement;
};

export function resolveAnnouncement(
  page: PageWithAnnouncement,
): AnnouncementData {
  // Own announcement takes priority
  if (page.announcement?.content?.length) {
    return { content: page.announcement.content };
  }

  // Walk up parent chain
  let ancestor = page.parent;
  while (ancestor) {
    if (
      ancestor.announcement?.content?.length &&
      ancestor.announcement.applyToChildren
    ) {
      return { content: ancestor.announcement.content };
    }
    ancestor = ancestor.parent;
  }

  return null;
}

// ─── GROQ fragment ────────────────────────────────────────────────────────────
// Add to your page/blog/docs queries. Fetches up to 3 levels of parent
// announcements to support inheritance.

export const announcementFragment = `
  announcement {
    content,
    applyToChildren
  },
  parent->{
    announcement {
      content,
      applyToChildren
    },
    parent->{
      announcement {
        content,
        applyToChildren
      },
      parent->{
        announcement {
          content,
          applyToChildren
        }
      }
    }
  }
`;

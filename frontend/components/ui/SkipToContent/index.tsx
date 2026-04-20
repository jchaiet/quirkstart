/**
 * SkipToContent.tsx
 *
 * Visually hidden link that becomes visible on focus.
 * Must be the first focusable element on the page.
 * Targets #main-content — the id on <main> in Layout.tsx.
 *
 * WCAG 2.1 Success Criterion 2.4.1 — Bypass Blocks
 */

import styles from "./styles.module.css";

export function SkipToContent() {
  return (
    <a href="#main-content" className={styles.skipLink}>
      Skip to main content
    </a>
  );
}

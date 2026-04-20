/**
 * ThemeScript.tsx
 *
 * Renders a blocking inline <script> in <head> that sets data-theme on <html>
 * before React hydrates and before any CSS is parsed. This eliminates the
 * flash of wrong theme on page load and navigation.
 *
 * Usage: place inside the <head> of your root layout.tsx:
 *
 *   import { ThemeScript } from "@/lib/ThemeScript";
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html lang="en" suppressHydrationWarning>
 *         <head>
 *           <ThemeScript />
 *         </head>
 *         <body>{children}</body>
 *       </html>
 *     );
 *   }
 *
 * NOTE: suppressHydrationWarning is required on <html> because the
 * data-theme attribute is set by this script before React hydrates,
 * so React sees a mismatch between server HTML (no attribute) and
 * client HTML (attribute set by script). suppressHydrationWarning
 * tells React to ignore this specific element's attribute differences.
 */

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme-mode');
    var theme = (stored === 'dark' || stored === 'light')
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`.trim();

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}

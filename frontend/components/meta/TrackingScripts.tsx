/**
 * TrackingScripts.tsx
 *
 * Renders analytics and tracking scripts from Sanity site settings.
 * Uses Next.js <Script> for optimal loading and usePathname() for
 * path-based filtering per script.
 *
 * Path matching supports:
 *   Exact:    /about
 *   Wildcard: /blog/*   (matches /blog/anything)
 *   Prefix:   /docs/*   (matches /docs/a/b/c)
 *
 * Scripts are skipped entirely in development.
 */

"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

type TrackingScript = {
  _key?: string;
  type: "GA4" | "GTM" | "MetaPixel" | "Custom";
  measurementId?: string;
  customScript?: string;
  strategy?: "afterInteractive" | "beforeInteractive" | "lazyOnload";
  enabled?: boolean;
  excludePaths?: string[];
  includePaths?: string[];
};

type TrackingScriptsProps = {
  scripts: TrackingScript[];
};

// ─── Path matching ────────────────────────────────────────────────────────────

function matchesPath(pattern: string, pathname: string): boolean {
  // Exact match
  if (!pattern.includes("*")) return pathname === pattern;

  // Wildcard — convert /blog/* to regex
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const regexStr = escaped.replace(/\*/g, ".*");
  return new RegExp(`^${regexStr}$`).test(pathname);
}

function shouldLoadScript(script: TrackingScript, pathname: string): boolean {
  // includePaths — if set, ONLY load on matching paths
  if (script.includePaths?.length) {
    return script.includePaths.some((p) => matchesPath(p, pathname));
  }

  // excludePaths — skip if current path matches any exclude pattern
  if (script.excludePaths?.length) {
    return !script.excludePaths.some((p) => matchesPath(p, pathname));
  }

  // No path constraints — load everywhere
  return true;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TrackingScripts({ scripts }: TrackingScriptsProps) {
  const pathname = usePathname();

  if (process.env.NODE_ENV !== "production") return null;
  if (!scripts?.length) return null;

  const active = scripts.filter(
    (s) => s.enabled !== false && shouldLoadScript(s, pathname),
  );

  if (!active.length) return null;

  return (
    <>
      {active.map((script, i) => {
        const key = script._key ?? `tracking-${i}`;
        const strategy = script.strategy ?? "afterInteractive";

        switch (script.type) {
          // ── Google Analytics 4 ──────────────────────────────────────────
          case "GA4":
            if (!script.measurementId) return null;
            return (
              <>
                <Script
                  key={`${key}-src`}
                  src={`https://www.googletagmanager.com/gtag/js?id=${script.measurementId}`}
                  strategy={strategy}
                />
                <Script
                  key={`${key}-init`}
                  id={`ga4-init-${script.measurementId}`}
                  strategy={strategy}
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${script.measurementId}');
                    `,
                  }}
                />
              </>
            );

          // ── Google Tag Manager ──────────────────────────────────────────
          case "GTM":
            if (!script.measurementId) return null;
            return (
              <Script
                key={`${key}-init`}
                id={`gtm-init-${script.measurementId}`}
                strategy={strategy}
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${script.measurementId}');
                  `,
                }}
              />
            );

          // ── Meta Pixel ──────────────────────────────────────────────────
          case "MetaPixel":
            if (!script.measurementId) return null;
            return (
              <Script
                key={key}
                id={`meta-pixel-${script.measurementId}`}
                strategy={strategy}
                dangerouslySetInnerHTML={{
                  __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${script.measurementId}');
                    fbq('track', 'PageView');
                  `,
                }}
              />
            );

          // ── Custom Script ───────────────────────────────────────────────
          case "Custom":
            if (!script.customScript) return null;
            const rawScript = script.customScript
              .replace(/^<script[^>]*>/i, "")
              .replace(/<\/script>$/i, "")
              .trim();
            return (
              <Script
                key={key}
                id={`custom-script-${i}`}
                strategy={strategy}
                dangerouslySetInnerHTML={{ __html: rawScript }}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}

// ─── GTM noscript fallback ────────────────────────────────────────────────────
// Must be placed immediately after <body> opening tag.
// Also path-filtered to match the main GTM script behaviour.

export function GtmNoscript({ scripts }: TrackingScriptsProps) {
  const pathname = usePathname();

  if (process.env.NODE_ENV !== "production") return null;

  const gtmScript = scripts?.find(
    (s) =>
      s.type === "GTM" &&
      s.enabled !== false &&
      s.measurementId &&
      shouldLoadScript(s, pathname),
  );

  if (!gtmScript) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmScript.measurementId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

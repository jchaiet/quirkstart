import { DM_Sans } from "next/font/google";
import { draftMode } from "next/headers";
import type { Viewport } from "next";
import { DraftModeTools } from "@/components/preview/DraftModeTools";
import "../../globals.css";
import "quirk-ui/tokens.css";
import { AppProviders } from "@/app/providers";
import { resolveLocale } from "@/lib/i18n";
import { ThemeScript } from "@/lib/ThemeScript";
import { setRequestLocale } from "@/lib/requestLocale";

/**
 * Variable font — one file covers all weights instead of two separate files.
 * Exposed as --font-sans CSS variable so globals.css can reference it via
 * --font-family-primary: var(--font-sans), sans-serif.
 */
const sans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-family-primary",
});

import { lightTheme, darkTheme } from "@/lib/theme";
import { getCachedSiteSettings } from "@/lib/pageHelpers";
import { OrganizationJsonLd } from "@/components/meta/OrganizationJsonLd";
import {
  TrackingScripts,
  GtmNoscript,
} from "@/components/meta/TrackingScripts";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: lightTheme.background },
    { media: "(prefers-color-scheme: dark)", color: darkTheme.background },
  ],
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string; site: string }>;
}>) {
  const { locale, site } = await params;
  const currentLocale = resolveLocale(locale);
  setRequestLocale(currentLocale);

  const siteSettings = await getCachedSiteSettings(site);

  // isEnabled is always false in production — Next.js enforces this.
  // The !isProd check was redundant.
  const { isEnabled } = await draftMode();

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <head>
        {/* Must be first — blocks rendering until theme is set */}
        <ThemeScript />
        {siteSettings && (
          <OrganizationJsonLd
            siteName={siteSettings.title ?? ""}
            siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ""}
            description={siteSettings.description}
            socialLinks={
              siteSettings.socialLinks
                ?.map((l: { url?: string }) => l.url)
                .filter(Boolean) as string[]
            }
          />
        )}
        {siteSettings?.trackingScripts?.length > 0 && (
          <TrackingScripts scripts={siteSettings.trackingScripts} />
        )}
      </head>
      <body className={sans.variable}>
        {siteSettings?.trackingScripts?.length > 0 && (
          <GtmNoscript scripts={siteSettings.trackingScripts} />
        )}
        <AppProviders currentLocale={currentLocale}>
          {isEnabled && <DraftModeTools />}
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

"use client";
import {
  HeroProvider,
  LocaleBridgeProvider,
  AppThemeProvider,
} from "quirk-ui/next";
import { ThemeWrapper } from "@/lib/ThemeWrapper";
import { defaultLocale, resolveLocale } from "@/lib/i18n";

export function AppProviders({
  children,
  currentLocale,
}: {
  children: React.ReactNode;
  currentLocale: string;
}) {
  const locale = resolveLocale(currentLocale);
  const isDefault = locale === defaultLocale;

  return (
    <AppThemeProvider>
      <ThemeWrapper>
        <LocaleBridgeProvider value={{ locale, isDefault }}>
          <HeroProvider>{children}</HeroProvider>
        </LocaleBridgeProvider>
      </ThemeWrapper>
    </AppThemeProvider>
  );
}

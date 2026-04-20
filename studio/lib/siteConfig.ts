/**
 * lib/siteConfig.ts
 *
 * Derives locale configuration from the frontend i18n.ts source of truth.
 * Adding a locale to frontend/lib/i18n.ts automatically updates the desk
 * structure — no changes needed here.
 */

import { locales, defaultLocale } from "../../frontend/lib/i18n";

export interface LocaleConfig {
  id: string;
  title: string;
  /** GROQ filter fragment for this locale's documents */
  filter: string;
}

function buildFilter(id: string): string {
  // Default locale also matches documents with no locale set
  // (older documents created before locale field was added)
  if (id === defaultLocale) {
    return `(locale == "${id}" || !defined(locale))`;
  }
  return `locale == "${id}"`;
}

export const LOCALES: LocaleConfig[] = locales.map((locale) => ({
  id: locale.id,
  title: locale.title,
  filter: buildFilter(locale.id),
}));

export const DEFAULT_LOCALE_ID = defaultLocale;

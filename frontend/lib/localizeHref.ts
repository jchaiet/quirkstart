import { defaultLocale } from "./i18n";
import { getRequestLocale } from "./requestLocale";

export function localizeHref(href: string) {
  const locale = getRequestLocale();

  if (!href.startsWith("/")) href = `/${href}`;

  return locale === defaultLocale ? href : `/${locale}${href}`;
}

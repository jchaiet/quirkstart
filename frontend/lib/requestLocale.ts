import { cache } from "react";
import { defaultLocale } from "./i18n";

const localeCache = cache(() => {
  let currentLocale: string = defaultLocale;

  return {
    get: () => currentLocale,
    set: (locale: string) => {
      currentLocale = locale;
    },
  };
});

export function setRequestLocale(locale: string) {
  localeCache().set(locale);
}

export function getRequestLocale(): string {
  return localeCache().get();
}

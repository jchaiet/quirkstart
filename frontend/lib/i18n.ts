export const locales = [
  { id: "en-us", title: "English (US)" },
  { id: "es-us", title: "Spanish (US)" },
] as const;

export type LocaleId = (typeof locales)[number]["id"];

export const defaultLocale: LocaleId = "en-us";

export function isValidLocale(locale: string): boolean {
  return locales.some((loc) => loc.id === locale);
}

export function resolveLocale(localeParam?: string): string {
  if (!localeParam) return defaultLocale;

  const normalized = localeParam.toLowerCase();
  return isValidLocale(normalized) ? normalized : defaultLocale;
}

// URL prefix → slug prefix mapping.
// Add new content types here to keep locale switching working correctly.
const CONTENT_PATH_PREFIXES: [string[], number][] = [
  [["blog", "articles"], 2], // /blog/articles/[slug] → strip 2 segments
  [["docs"], 1], // /docs/[slug] → strip 1 segment
];

function nextPathToSanitySlug(path: string): string {
  const segments = path.replace(/^\/+/, "").split("/");

  // Remove locale prefix if present
  if (isValidLocale(segments[0])) segments.shift();

  // Check known content path prefixes and strip them
  for (const [prefix, stripCount] of CONTENT_PATH_PREFIXES) {
    const matches = prefix.every((seg, i) => segments[i] === seg);
    if (matches) return segments.slice(stripCount).join("/");
  }

  return segments.join("/");
}

async function pageExists(locale: string, slug: string): Promise<boolean> {
  const encodedSlug = encodeURIComponent(slug);
  return fetch(`/api/page-exists?locale=${locale}&slug=${encodedSlug}`)
    .then((res) => res.json())
    .then((data) => data.exists);
}

export async function getLocaleLink(
  currentPath: string,
  targetLocale: string,
  currentLocale: string,
): Promise<string> {
  if (!isValidLocale(targetLocale)) {
    throw new Error(`Invalid locale: ${targetLocale}`);
  }

  if (currentLocale === targetLocale) {
    return currentPath;
  }

  const slug = nextPathToSanitySlug(currentPath);
  //Special case for en-us homepage
  if (!slug) {
    return targetLocale === defaultLocale ? `/` : `/${targetLocale}`;
  }

  if (slug) {
    const exists = await pageExists(targetLocale, slug);
    if (exists) {
      //Blog articles
      if (currentPath.includes("/blog/articles/")) {
        return targetLocale === defaultLocale
          ? `/blog/articles/${slug}`
          : `/${targetLocale}/blog/articles/${slug}`;
      }

      //Standard pages
      return targetLocale === defaultLocale
        ? `/${slug}`
        : `/${targetLocale}/${slug}`;
    }
  }

  return targetLocale === defaultLocale ? `/` : `/${targetLocale}`;
}

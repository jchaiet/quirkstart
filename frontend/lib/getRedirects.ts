import { sanityClient } from "../sanity/client";

interface SanityRedirect {
  source: string;
  permanent?: boolean;
  destinationSlug?: { current: string };
  destinationPage?: {
    slug?: string;
  };
}

interface NextRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

export async function getRedirects(): Promise<NextRedirect[]> {
  const redirects = await sanityClient.fetch<SanityRedirect[]>(`
    *[_type == "redirect"]{
      "source": source.current,
      permanent,
      destinationSlug,
      destinationPage->{
        "slug": slug.current
      }
    }  
  `);

  return redirects
    .map((redirect) => {
      const pageSlug = redirect.destinationPage?.slug;
      const destination = pageSlug
        ? pageSlug === "home"
          ? "/"
          : `/${pageSlug}`
        : redirect.destinationSlug?.current;

      if (!destination) return null;

      return {
        source: redirect.source,
        destination,
        permanent: redirect.permanent ?? true,
      };
    })
    .filter((r): r is NextRedirect => r !== null);
}

import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = {
  _type?: string;
  slug?: { current?: string };
  locale?: string;
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response(
        "Missing environment variable SANITY_REVALIDATE_SECRET",
        { status: 500 },
      );
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return new Response(
        JSON.stringify({ message: "Invalid signature", isValidSignature }),
        { status: 401 },
      );
    }

    const { _type, slug, locale } = body ?? {};
    const revalidated: string[] = [];

    // ── Navigation / site-wide documents ───────────────────────────────────
    // These don't have slugs but affect every page — revalidate the full tree.
    if (
      _type === "navigation" ||
      _type === "site" ||
      _type === "redirect" ||
      _type === "singleton"
    ) {
      revalidatePath("/", "layout");
      revalidated.push("/ (layout — full site)");
    }

    // ── Slug-based documents ───────────────────────────────────────────────
    else if (slug?.current) {
      const localePrefix = locale && locale !== "en-us" ? `/${locale}` : "";

      switch (_type) {
        case "blog": {
          const path = `${localePrefix}/blog/articles/${slug.current}`;
          revalidatePath(path);
          revalidated.push(path);
          // Also revalidate blog index since article list may have changed
          revalidatePath(`${localePrefix}/blog`);
          revalidated.push(`${localePrefix}/blog`);
          break;
        }
        case "page":
        default: {
          const path =
            slug.current === "home"
              ? `${localePrefix}/`
              : `${localePrefix}/${slug.current}`;
          revalidatePath(path);
          revalidated.push(path);
          break;
        }
      }
    } else {
      return new Response(
        JSON.stringify({
          message: "Bad request — no slug or known type",
          body,
        }),
        { status: 400 },
      );
    }

    const message = `Revalidated: ${revalidated.join(", ")}`;
    console.log(`[revalidate] ${message}`);
    return NextResponse.json({ message, revalidated });
  } catch (error) {
    console.error("[revalidate] Error:", error);
    return new Response((error as Error).message, { status: 500 });
  }
}

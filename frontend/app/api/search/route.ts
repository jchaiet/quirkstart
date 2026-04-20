import { type NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/client";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const { allowed, retryAfter } = rateLimit(req, {
    max: 30,
    windowMs: 60_000,
    prefix: "search",
  });
  if (!allowed) return rateLimitResponse(retryAfter);

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();
  const site = searchParams.get("site");
  const locale = searchParams.get("locale");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const tokens = query
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => `${t}*`);

  try {
    const results = await sanityClient.fetch(
      `*[_type in ["page", "blog", "docs"]
        && site->slug.current == $site
        && language == $locale
        && (${tokens.map((_, i) => `title match $token${i} || excerpt match $token${i} || metadata.description match $token${i}`).join(" || ")})
      ] {
        _type,
        title,
        "slug": slug.current,
        excerpt,
        "description": metadata.description,
      }[0...20]`,
      {
        site,
        locale,
        ...Object.fromEntries(tokens.map((t, i) => [`token${i}`, t])),
      },
    );

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[search] Query failed:", err);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}

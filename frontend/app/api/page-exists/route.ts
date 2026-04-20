import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");
  const slug = searchParams.get("slug");

  if (!locale) {
    return NextResponse.json(
      { error: "Missing locale parameter" },
      { status: 400 }
    );
  }

  if (!slug) {
    const homeExists = await checkPageExists(locale, "home");
    return NextResponse.json({ exists: homeExists });
  }

  const exists = await checkPageExists(locale, slug);
  return NextResponse.json({ exists });
}

async function checkPageExists(locale: string, slug: string) {
  const query = `
  count(
    *[
      (_type == "page" || _type == "blog") && 
      slug.current == $slug && 
      locale == $locale
    ]
  ) > 0`;
  const exists = await sanityClient.fetch(query, { slug, locale });
  return Boolean(exists);
}

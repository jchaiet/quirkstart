"use client";
import React from "react";
import {
  type ContentBlockProps,
  type QuoteBlockProps,
  type RichTextBlockProps,
  type FormValue,
  AccordionBlock,
  AdditionalCategoriesBlock,
  BlogArticleCard,
  CardGridBlock,
  CarouselBlock,
  ContentBlock,
  DocumentListBlock,
  FeaturedDocumentsBlock,
  FormBlock,
  HeroBlock,
  LocaleLink,
  MarkdownBlock,
  QuoteBlock,
  RichTextBlock,
  StickyScrollBlock,
  TabsBlock,
  WasHelpfulBlock,
  renderRichText,
  renderCallToAction,
} from "quirk-ui/next";
import {
  type PageSection,
  type SingletonBlockProps,
  type ArticleItem,
} from "quirk-ui/sanity";
import { type RenderImageProps } from "quirk-ui/core";
import { nextImageAdapter, resolveImage, imageSizes } from "@/lib/imageAdapter";

// ─── Shared render helpers ───────────────────────────────────────────────────
// Defined outside PageBuilder so they're stable references across renders

function renderLocaleLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <LocaleLink href={href} className={className}>
      {children}
    </LocaleLink>
  );
}

function renderNextImage({
  src,
  alt,
  fill,
  sizes,
  priority,
  width,
  height,
  style,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  return nextImageAdapter.render({
    src,
    alt,
    fill,
    sizes,
    priority,
    width,
    height,
    style,
  });
}

export function PageBuilder({
  sections,
  pageData,
}: {
  sections: PageSection[];
  pageData: {
    timeToRead: number;
    categories?: {
      _id: string;
      title: string;
      slug: { current: string };
    }[];
    articleType: string;
  };
}) {
  return (
    <>
      {sections?.map((section, i) => {
        switch (section._type) {
          case "heroBlock":
            return (
              <HeroBlock
                key={i}
                {...section}
                pageData={pageData}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
              />
            );
          case "cardGridBlock":
            return (
              <CardGridBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
              />
            );
          case "carouselBlock":
            return (
              <CarouselBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
              />
            );
          case "contentBlock":
            return (
              <ContentBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
                renderImage={(props: RenderImageProps) =>
                  resolveImage(props, imageSizes.half)
                }
              />
            );
          case "stickyScrollBlock":
            return (
              <StickyScrollBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
              />
            );
          case "tabsBlock":
            return (
              <TabsBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
              />
            );
          case "richTextBlock":
            return (
              <RichTextBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
              />
            );
          case "markdownBlock":
            return <MarkdownBlock key={i} {...section} />;
          // case "tableBlock":
          //   return <TableBlock key={i} {...section} />;
          case "quoteBlock":
            return (
              <QuoteBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
              />
            );
          case "accordionBlock":
            return (
              <AccordionBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
              />
            );
          case "documentListBlock": {
            const isBlogList =
              !section.documentType || section.documentType === "blog";
            return (
              <DocumentListBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
                renderCard={(article: ArticleItem) =>
                  isBlogList ? (
                    <BlogArticleCard
                      key={article._id}
                      article={article}
                      renderImage={renderNextImage}
                      renderLink={renderLocaleLink}
                    />
                  ) : null
                }
              />
            );
          }
          case "featuredDocumentsBlock": {
            const isBlogDocs =
              !section.documentType || section.documentType === "blog";
            return (
              <FeaturedDocumentsBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                renderLink={renderLocaleLink}
                renderCard={({
                  article,
                  className,
                  index,
                  layout,
                  limit,
                }: {
                  article: ArticleItem;
                  className?: string;
                  index: number;
                  layout?: string;
                  limit?: number;
                }) => {
                  return isBlogDocs ? (
                    <BlogArticleCard
                      key={article._id}
                      article={article}
                      className={className}
                      index={index}
                      layout={layout}
                      limit={limit}
                      renderImage={renderNextImage}
                      renderLink={renderLocaleLink}
                    />
                  ) : null;
                }}
              />
            );
          }
          case "additionalCategoriesBlock":
            return (
              <AdditionalCategoriesBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
              />
            );
          case "wasHelpfulBlock":
            return (
              <WasHelpfulBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                renderCallToAction={renderCallToAction}
                imageAdapter={nextImageAdapter}
              />
            );

          case "singletonBlock":
            const singletonBlock = section as SingletonBlockProps;
            const fetchedSingleton = singletonBlock.singleton;

            if (!fetchedSingleton) {
              if (process.env.NODE_ENV === "development") {
                console.warn(
                  "[PageBuilder] singletonBlock has no resolved singleton — check GROQ query or Sanity document",
                  section,
                );
              }
              return null;
            }

            switch (fetchedSingleton.blockSelection) {
              case "contentBlock":
                return (
                  <ContentBlock
                    key={i}
                    {...(fetchedSingleton.blockContent as ContentBlockProps)}
                    renderRichText={renderRichText}
                    renderCallToAction={renderCallToAction}
                    imageAdapter={nextImageAdapter}
                  />
                );
              case "richTextBlock":
                return (
                  <RichTextBlock
                    key={i}
                    {...(fetchedSingleton.blockContent as RichTextBlockProps)}
                    renderRichText={renderRichText}
                    renderCallToAction={renderCallToAction}
                    imageAdapter={nextImageAdapter}
                  />
                );
              case "quoteBlock":
                return (
                  <QuoteBlock
                    key={i}
                    {...(fetchedSingleton.blockContent as QuoteBlockProps)}
                    renderRichText={renderRichText}
                    renderCallToAction={renderCallToAction}
                    imageAdapter={nextImageAdapter}
                  />
                );
              default:
                console.warn(
                  "Unknown singleton block type",
                  fetchedSingleton.blockSelection,
                  fetchedSingleton,
                );
                return (
                  <div key={i}>
                    Unknown singleton block type:{" "}
                    {fetchedSingleton.blockSelection}
                  </div>
                );
            }

          case "formBlock":
            return (
              <FormBlock
                key={i}
                {...section}
                renderRichText={renderRichText}
                onSubmit={async (data: Record<string, FormValue>) => {
                  try {
                    const res = await fetch("/api/form-submit", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        formId: section._key,
                        data,
                      }),
                    });
                    const result = await res.json();
                    if (result.redirectSlug) {
                      window.location.href = `/${result.redirectSlug}`;
                    }
                    return result;
                  } catch {
                    return { success: false, message: "Something went wrong." };
                  }
                }}
              />
            );

          default:
            const unknownSection = section as { _type?: string };
            console.warn("Unknown block type", unknownSection._type, section);
            return <div key={i}>Unknown block: {unknownSection._type}</div>;
        }
      })}
    </>
  );
}

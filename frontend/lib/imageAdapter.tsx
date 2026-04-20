/**
 * lib/imageAdapter.tsx
 *
 * Shared next/image adapter for all QuirkUI blocks and cards.
 *
 * QuirkUI blocks accept an `imageAdapter` prop (or `renderImage` prop) so
 * they stay framework-agnostic. This file provides the Next.js implementation
 * to pass in from the boilerplate side.
 *
 * Usage:
 *
 *   import { nextImageAdapter, renderImage } from "@/lib/imageAdapter";
 *
 *   // For blocks that accept imageAdapter (HeroBlock, CarouselBlock etc.)
 *   <HeroBlock {...section} imageAdapter={nextImageAdapter} />
 *
 *   // For blocks that accept renderImage (ContentBlock, GridCard etc.)
 *   <ContentBlock {...section} renderImage={renderImage} />
 */

import Image from "next/image";
import type { ImageAdapter, RenderImageProps } from "quirk-ui/core";

// Inline type mirrors ImageAdapter["render"]'s props exactly.
// We define it explicitly rather than using Parameters<ImageAdapter["render"]>[0]
// because that derivation resolves to unknown when the type is not yet built.
type ImageAdapterRenderProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  style?: React.CSSProperties;
  className?: string;
  draggable?: boolean;
};

// ─── nextImageAdapter ─────────────────────────────────────────────────────────
// For blocks that accept the full ImageAdapter interface (HeroBlock etc.)

export const nextImageAdapter: ImageAdapter = {
  render: ({
    src,
    alt,
    width,
    height,
    fill,
    priority,
    fetchPriority,
    sizes,
    style,
    className,
  }: ImageAdapterRenderProps) => (
    <Image
      src={src}
      alt={alt}
      width={!fill ? (width ?? 1200) : undefined}
      height={!fill ? (height ?? 800) : undefined}
      fill={fill}
      priority={priority}
      fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
      sizes={sizes ?? "(max-width: 767px) 100vw, 1200px"}
      style={style}
      className={className}
    />
  ),
};

// ─── resolveImage ─────────────────────────────────────────────────────────────
// Convenience wrapper for blocks that accept a renderImage render prop
// (ContentBlock, GridCard etc.) rather than the full ImageAdapter interface.
// Accepts an optional sizes override for responsive hints.
//
// Named resolveImage (not renderImage) to avoid collision with the
// renderImage prop name used by ContentBlock and other blocks.

export function resolveImage(props: RenderImageProps, sizes?: string) {
  return nextImageAdapter.render({
    ...props,
    sizes: sizes ?? props.sizes ?? "(max-width: 767px) 100vw, 1200px",
  });
}

// ─── Preset sizes ─────────────────────────────────────────────────────────────
// Common responsive sizes strings — import and pass to resolveImage or
// nextImageAdapter.render() for accurate browser resource selection.

export const imageSizes = {
  /** Full viewport width — hero backgrounds, full-bleed sections */
  fullWidth: "100vw",
  /** Constrained to layout max-width — most content blocks */
  contentWidth: "(max-width: 767px) 100vw, 1250px",
  /** Half the layout width — split layouts */
  half: "(max-width: 767px) 100vw, 625px",
  /** Card grid items — roughly 1/3 of layout width on desktop */
  card: "(max-width: 767px) 100vw, 400px",
  /** Small card thumbnails */
  thumbnail: "(max-width: 767px) 100vw, 200px",
} as const;

# QuirkStart — Next.js Frontend

Next.js 15 frontend for the QuirkStart multi-site, multi-locale boilerplate. Powered by QuirkUI component library and Sanity CMS.

---

## Stack

- **Next.js 15** (App Router, React Server Components)
- **QuirkUI** — custom component library (`quirk-ui`)
- **Sanity** (`next-sanity`) — content layer
- **TypeScript**
- **CSS Modules**
- **DM Sans** variable font (via `next/font/google`)

---

## Getting Started

```bash
cd frontend
pnpm install
node scripts/copy-fa-fonts.mjs
pnpm dev
```

App runs at `http://localhost:3000`.

### Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_API_READ_TOKEN=your_token
SANITY_STUDIO_API_READ_WRITE_TOKEN=your_token
SANITY_REVALIDATE_SECRET=your_webhook_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
SMTP_FROM="Forms <noreply@yourdomain.com>"
```

---

## Project Structure

```
frontend/
├── app/
│   ├── [site]/[locale]/
│   │   ├── layout.tsx                        # Root layout — fonts, CSS, providers, OrganizationJsonLd
│   │   ├── [[...slug]]/page.tsx              # Main page route
│   │   ├── blog/articles/[...slug]/page.tsx  # Blog articles
│   │   └── docs/[...slug]/page.tsx           # Docs pages
│   ├── api/
│   │   ├── form-submit/route.ts              # Form submission — email + webhook
│   │   ├── revalidate/route.ts               # On-demand cache revalidation
│   │   ├── search/route.ts                   # Full-text search
│   │   ├── articles/route.ts                 # Paginated article fetch
│   │   ├── helpful/route.ts                  # Was this helpful votes
│   │   ├── page-exists/route.ts              # Locale link validation
│   │   └── draft-mode/                       # Draft mode enable/disable
│   ├── globals.css                           # Global styles, CSS tokens, FA imports
│   ├── providers.tsx                         # AppThemeProvider, LocaleBridgeProvider
│   ├── robots.ts                             # Environment-aware robots.txt
│   ├── sitemap.ts                            # Dynamic locale-aware sitemap
│   └── viewport.ts                           # Next.js viewport export
├── components/
│   ├── ErrorBoundary.tsx                     # React error boundary for page builder blocks
│   ├── layout/
│   │   ├── AnnouncementBar.tsx               # Sticky announcement banner above nav
│   │   ├── Header.tsx                        # Navbar wrapper (client)
│   │   ├── Footer.tsx                        # Footer wrapper
│   │   ├── Layout.tsx                        # Main layout shell
│   │   ├── BlogHeader/                       # Blog section sub-nav
│   │   └── styles.module.css
│   ├── templates/
│   │   └── PageTemplate.tsx                  # Server component — Layout composition
│   ├── preview/
│   │   ├── DraftModeTools.tsx
│   │   └── SanityLiveVisualEditing.tsx
│   ├── meta/
│   │   ├── HeroPreload.tsx
│   │   ├── JsonLd.tsx
│   │   ├── OrganizationJsonLd.tsx
│   │   ├── ArticleJsonLd.tsx
│   │   ├── BreadcrumbJsonLd.tsx
│   │   └── WebPageJsonLd.tsx
│   └── ui/
│       ├── SearchModal/
│       ├── LocaleModal/
│       ├── ThemeToggle/
│       └── SkipToContent/
├── lib/
│   ├── pageBuilder.tsx             # Block → component switch, render props, error boundaries
│   ├── pageHelpers.ts              # generatePageMetadata, fetchNavigationData
│   ├── rateLimit.ts                # Shared in-memory rate limiter for API routes
│   ├── resolveAnnouncement.ts      # Announcement inheritance resolver + GROQ fragment
│   ├── resolveSections.ts          # Image URL resolution, markdown processing
│   ├── imageAdapter.tsx            # next/image adapter for QuirkUI blocks
│   ├── portableTextUtils.tsx       # renderRichText, extractText
│   ├── mapNavigation.tsx
│   ├── mapGroups.tsx
│   ├── mapUtilityItems.tsx
│   ├── mapSocialLinks.ts
│   ├── getRedirects.ts
│   ├── i18n.ts                     # Locale definitions (monorepo source of truth)
│   ├── localizeHref.ts
│   ├── requestLocale.ts
│   ├── ThemeScript.tsx
│   ├── ThemeWrapper.tsx
│   └── theme.ts                    # lightTheme / darkTheme token objects
├── sanity/
│   ├── client.ts
│   ├── live.ts
│   ├── fetch.ts
│   └── queries/
│       ├── fragments.ts            # Reusable GROQ fragments
│       └── index.ts
├── scripts/
│   └── copy-fa-fonts.mjs
└── next.config.ts
```

---

## Routing

| URL                                | Maps to                            |
| ---------------------------------- | ---------------------------------- |
| `/`                                | Default site, default locale, home |
| `/es-us/`                          | Spanish (US) home                  |
| `/blog/articles/my-post`           | Blog article                       |
| `/es-us/blog/articles/mi-articulo` | Spanish blog article               |
| `/docs/getting-started`            | Docs page                          |

---

## Locales

Defined in `lib/i18n.ts` — single source of truth for the monorepo:

```ts
export const locales = [
  { id: "en-us", title: "English (US)" },
  { id: "es-us", title: "Spanish (US)" },
] as const;

export const defaultLocale = "en-us";
```

Adding a locale here automatically updates the Studio desk structure, the `documentInternationalization` plugin, and frontend routing.

---

## Page Builder

`lib/pageBuilder.tsx` maps Sanity `_type` values to QuirkUI blocks. Each block is wrapped in `BlockErrorBoundary` — broken blocks render nothing in production and show a debug overlay in development.

### Render Props

| Render Prop          | Used by                                      |
| -------------------- | -------------------------------------------- |
| `renderRichText`     | All blocks with text                         |
| `renderCallToAction` | Blocks with CTAs                             |
| `imageAdapter`       | Blocks with images (`next/image`)            |
| `renderImage`        | ContentBlock, CarouselBlock, BlogArticleCard |
| `renderLink`         | FeaturedDocumentsBlock, BlogArticleCard      |
| `renderCard`         | FeaturedDocumentsBlock, DocumentListBlock    |
| `onSubmit`           | FormBlock — wired to `/api/form-submit`      |

### Supported Blocks

`heroBlock` · `cardGridBlock` · `carouselBlock` · `contentBlock` · `stickyScrollBlock` · `tabsBlock` · `richTextBlock` · `markdownBlock` · `quoteBlock` · `accordionBlock` · `documentListBlock` · `featuredDocumentsBlock` · `formBlock` · `singletonBlock` · `additionalCategoriesBlock` · `wasHelpfulBlock`

---

## Announcements

Announcement banners are driven by the `announcement` field on page/blog/docs documents. The `resolveAnnouncement()` helper in `lib/resolveAnnouncement.ts` walks the parent chain to resolve inherited announcements.

`AnnouncementBar` renders above the nav, sticks to the top when `isSticky` is true, and sets `--announcement-height` on `<body>` via `ResizeObserver` so the sticky nav offsets correctly below it.

Colours are theme-controlled via `theme.ts`:

```ts
announcement: {
  background: "#004a99",
  text: "#ffffff",
  link: "#b3d1ff",
}
```

---

## SEO

### Page-Level Metadata

`generatePageMetadata(site, pageMeta?)` in `pageHelpers.ts` — page values override site defaults:

| Field          | Priority                      |
| -------------- | ----------------------------- |
| `title`        | page → site → fallback        |
| `description`  | page → site                   |
| `ogImage`      | page → site default OG image  |
| `canonicalUrl` | page → `NEXT_PUBLIC_SITE_URL` |
| `robots`       | page → site                   |

### JSON-LD Structured Data

| Schema                           | File                     | Rendered in |
| -------------------------------- | ------------------------ | ----------- |
| `Organization`                   | `layout.tsx`             | `<head>`    |
| `WebPage`                        | `[[...slug]]/page.tsx`   | `<body>`    |
| `BlogPosting`                    | `blog/articles/page.tsx` | `<body>`    |
| `TechArticle` + `BreadcrumbList` | `docs/page.tsx`          | `<body>`    |

---

## Forms

Fully Sanity-driven. Editors build forms in the page builder using **Form Block**.

### Field Types

`text` · `email` · `phone` · `number` · `url` · `textarea` · `select` · `multiselect` · `checkbox` · `checkboxGroup` · `radio` · `date` · `range` · `hidden`

### Submission Config

| Field             | Description                               |
| ----------------- | ----------------------------------------- |
| `submissionType`  | `email` / `webhook` / `both`              |
| `emailTo`         | Recipient address                         |
| `replyTo`         | Name of an email field to use as reply-to |
| `webhookUrl`      | Endpoint URL                              |
| `webhookSecret`   | Sent as `X-Webhook-Secret` header         |
| `successRedirect` | Page to redirect to after submission      |

---

## Navigation & Layout

| `variant`     | `isSticky` | Behaviour                                                                                             |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `standard`    | `true`     | Fixed nav, `<main>` offset by `--nav-height` + `--announcement-height`                                |
| `standard`    | `false`    | Nav in document flow                                                                                  |
| `transparent` | `true`     | Overlays content. `fullBleed`/`tile` handle clearance internally. Non-overlay blocks offset on mobile |
| `transparent` | `false`    | In document flow, overlays content                                                                    |

```css
--nav-height: 95px;
@media (max-width: 767px) {
  --nav-height: 85px;
}
```

When an announcement is visible, `--announcement-height` is added to all sticky offsets automatically.

---

## Rate Limiting

All public API routes are rate limited via `lib/rateLimit.ts`:

| Route              | Limit         |
| ------------------ | ------------- |
| `/api/form-submit` | 5 req/min/IP  |
| `/api/search`      | 30 req/min/IP |
| `/api/articles`    | 30 req/min/IP |
| `/api/helpful`     | 10 req/min/IP |

In-memory store — resets on server restart. For multi-instance deployments swap with [Upstash Redis](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview).

---

## Accessibility

- **Skip-to-content link** — first focusable element. Targets `<main id="main-content">`. WCAG 2.1 SC 2.4.1.
- **Focus trap** — Tab stays inside open mobile menu
- **Focus restoration** — focus returns to hamburger button on menu close
- **Escape key** — closes mobile menu
- **`aria-modal`** — set on mobile menu overlay when open
- **Announcement region** — `role="region" aria-label="Announcement"` with dismiss button

---

## On-Demand Revalidation

`/api/revalidate` called by Sanity webhook on publish:

| Document type                                    | Revalidated                                   |
| ------------------------------------------------ | --------------------------------------------- |
| `page`                                           | `/{locale}/{slug}`                            |
| `blog`                                           | `/{locale}/blog/articles/{slug}` + blog index |
| `docs`                                           | `/{locale}/docs/{slug}`                       |
| `navigation` / `site` / `redirect` / `singleton` | `/` layout (all pages)                        |

---

## Theming

Three-layer system: CSS tokens → `[data-theme]` attribute → JS token injection after mount. `ThemeScript` in `<head>` prevents flash of wrong theme.

Theme tokens are defined in `lib/theme.ts` and include:

- `primary`, `secondary` colour scales
- `button` variants (primary, secondary, blurred, etc.)
- `navigation` transparent link colours
- `announcement` background, text, and link colours
- `states` (info, success, error, warning)

---

## Performance

| Optimisation  | Implementation                                                            |
| ------------- | ------------------------------------------------------------------------- |
| Variable font | DM Sans single file via `next/font/google`                                |
| Token CSS     | `quirk-ui/tokens.css` (~15KB) vs 210KB monolithic                         |
| Component CSS | Per-component via `libInjectCss`                                          |
| Hero preload  | `HeroPreload` server component                                            |
| Markdown      | Processed server-side via remark in `resolveSections.ts` — zero client JS |
| Draft tools   | Dynamic import, `ssr: false`                                              |
| Site settings | React `cache()` deduplication                                             |
| Page metadata | Shared `getPage` cache between `generateMetadata` and page component      |

---

## Building

```bash
pnpm build
pnpm start
pnpm analyze   # Set ANALYZE=true
```

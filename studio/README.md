# QuirkStart — Sanity Studio

Sanity Studio for the QuirkStart multi-site, multi-locale boilerplate. Manages content for all sites built on the Next.js frontend.

---

## Stack

- **Sanity Studio v3**
- **Document Internationalization** (`@sanity/document-internationalization`)
- **Presentation Tool** (visual editing / live preview)
- **Media Plugin** (`sanity-plugin-media`)

---

## Getting Started

```bash
cd studio
pnpm install
pnpm dev
```

Studio runs at `http://localhost:3333`.

### Environment Variables

```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3000
SANITY_STUDIO_API_READ_WRITE_TOKEN=your_token
```

---

## Project Structure

```
studio/
├── components/
│   ├── Logo.tsx
│   ├── SyncedImageInput.tsx        # Auto-populates hero image from featuredImage
│   └── SyncedRichTextInput.tsx     # Auto-populates hero title from article title
├── lib/
│   ├── client.ts
│   ├── parentChild.ts              # Hierarchical document list builder
│   ├── siteConfig.ts               # Locale config — derived from frontend/lib/i18n.ts
│   └── slugPrefixTemplate.ts
├── plugins/
│   ├── customStudioStyles.ts
│   └── syncCategories.ts
├── schemaTypes/
│   ├── blocks/                     # Page builder block schemas
│   │   ├── heroBlockType.ts
│   │   ├── contentBlockType.ts
│   │   ├── richTextBlockType.ts
│   │   ├── markdownBlockType.ts
│   │   ├── formBlockType.ts
│   │   └── ...
│   ├── objects/
│   │   ├── announcementField.ts    # Announcement object (content + applyToChildren)
│   │   ├── formFieldType.ts
│   │   ├── formStepType.ts
│   │   ├── callToActionType.ts
│   │   └── ...
│   ├── fields/
│   └── styles/
├── scripts/
│   └── cleanFeaturedImage.ts
├── deskStructure.ts
└── sanity.config.ts
```

---

## Locales

Locales are defined in **`frontend/lib/i18n.ts`** — the single source of truth for the entire monorepo.

```ts
export const locales = [
  { id: "en-us", title: "English (US)" },
  { id: "es-us", title: "Spanish (US)" },
  { id: "fr-fr", title: "French (France)" }, // ← add here
] as const;
```

This automatically updates the Studio desk structure, the `documentInternationalization` plugin, and frontend routing.

---

## Desk Structure

Content organised by **Site → Locale → Document**:

```
Content
├── Sites
├── Pages by Site
│   └── [Site Name]
│       ├── English (US)
│       └── Spanish (US)
├── Articles by Site
├── Docs by Site
├── Navigation
├── Categories by Site
├── Singletons
└── Redirects
```

---

## Schema Overview

### Page Builder Blocks

| Block                    | Description                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `heroBlock`              | Hero with image/video/CTA. Layouts: `default`, `split`, `fullBleed`, `tile`, `blog` |
| `richTextBlock`          | Portable Text content                                                               |
| `markdownBlock`          | Markdown content — processed server-side via remark, zero client JS                 |
| `contentBlock`           | Split/media + text                                                                  |
| `formBlock`              | Multi-step form block — fully Sanity-driven                                         |
| `featuredDocumentsBlock` | Dynamic or manual article grid/carousel                                             |
| `documentListBlock`      | Filterable, paginated document list                                                 |
| `cardGridBlock`          | Card grid with multiple card variants                                               |
| `carouselBlock`          | Card carousel                                                                       |
| `accordionBlock`         | Expandable accordion                                                                |
| `tabsBlock`              | Tabbed content                                                                      |
| `stickyScrollBlock`      | Scroll-driven sticky content                                                        |
| `quoteBlock`             | Pull quote                                                                          |
| `singletonBlock`         | Reference to a reusable singleton document                                          |

### Style Options

Composed per-block via `styleOptionsField(groups)`:

| Group         | Description                          |
| ------------- | ------------------------------------ |
| `layout`      | Hero layout variant — heroBlock only |
| `padding`     | Top/bottom padding scale             |
| `background`  | Section background colour            |
| `border`      | Border colour                        |
| `imageRadius` | Image corner radius — contentBlock   |
| `width`       | Content width constraint             |
| `orientation` | Content orientation                  |

---

## Announcements

All page types (`page`, `blog`, `docs`) include an `announcement` field in the **Details** group.

### Fields

| Field             | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `content`         | Portable Text — supports bold, italic, and links            |
| `applyToChildren` | When enabled, cascades this announcement to all child pages |

### Inheritance

The frontend resolves which announcement to show by walking the parent chain. A page's own announcement takes priority. If none, the nearest ancestor with `applyToChildren: true` is used (up to 4 levels deep).

---

## Forms

Form blocks are fully editor-driven. Editors build forms in the page builder.

### Form Field Types

| Sanity `fieldType`                            | QuirkUI Component         |
| --------------------------------------------- | ------------------------- |
| `text` / `email` / `phone` / `number` / `url` | `Input`                   |
| `textarea`                                    | `Textarea`                |
| `select`                                      | `Select` (single)         |
| `multiselect`                                 | `Select` (multiple)       |
| `checkbox`                                    | `Checkbox`                |
| `checkboxGroup`                               | `Fieldset` + `Checkbox[]` |
| `radio`                                       | `Fieldset` + `Radio[]`    |
| `date`                                        | `DatePicker`              |
| `range`                                       | `Range`                   |
| `hidden`                                      | `Input` type="hidden"     |

### Submission Config

Each form block has a **Submission** group with:

- `submissionType` — `email` / `webhook` / `both`
- `emailTo`, `emailSubject`, `replyTo`
- `webhookUrl`, `webhookSecret`
- `successMessage`, `errorMessage`, `successRedirect`

---

## Singletons

Reusable content blocks referenced from page builders. Editing the singleton updates it everywhere it's used.

### Supported Block Types

`heroBlock` · `contentBlock` · `richTextBlock` · `quoteBlock` · `rating`

### Creating a Singleton

1. Navigate to **Singletons → Create new**
2. Set **Title**, **Identifier**, and **Block Type**
3. Fill in block content
4. Publish

---

## Blog Articles

Smart defaults for new articles:

- **Hero image auto-sync** — `featuredImage` auto-populates the hero block image
- **Hero title auto-sync** — article `title` auto-populates the hero heading
- **Default page builder** — `heroBlock` + `richTextBlock` + `featuredDocumentsBlock` (carousel, blog type)

---

## Navigation

| Field                                                 | Options                            |
| ----------------------------------------------------- | ---------------------------------- |
| `navigationType`                                      | `default` / `advanced` / `sidebar` |
| `variant`                                             | `standard` / `transparent`         |
| `isSticky`                                            | `true` / `false`                   |
| `showSearch` / `showLocaleSelect` / `showThemeToggle` | `true` / `false`                   |
| `alignment`                                           | `left` / `center` / `right`        |

Each site references a `defaultNavigation` and `defaultFooter` by slug. Individual pages can override both.

---

## Redirects

Redirect documents are fetched at build time by `next.config.ts`:

- `source` — path to redirect from (must start with `/`, must be unique)
- `destinationPage` — internal page reference
- `destinationSlug` — manual path or external URL
- `permanent` — `true` = 301, `false` = 302

---

## Visual Editing / Draft Mode

Presentation Tool configured for live visual editing. Draft mode enabled via `/api/draft-mode/enable`.

Preview origin set via `SANITY_STUDIO_PREVIEW_ORIGIN` in `.env`.

---

## Custom Actions

| Schema Type                        | Actions                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| `blog`, `page`, `docs`, `category` | `SetSlugAndPublishAction` — sets slug before publishing |
| `blog`                             | `SyncCategories` — syncs category assignments           |

---

## Publishing

```bash
pnpm build
pnpm deploy
```

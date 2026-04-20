# QuirkStart – Sanity + Next.js Starter

A production-ready boilerplate for building multi-site, multi-locale websites using Next.js 15 and Sanity Studio. Powered by the QuirkUI component library.

## Table of Contents

[Setup](#setup)  
[Getting Started](#getting-started)  
[Announcements](#announcements)  
[Redirects](#redirects)  
[Managing Locales and Translations](#managing-locales-and-translations)  
[Multi-Site Setup](#multi-site-setup)  
[Forms](#forms)  
[Singletons](#singletons)  
[Additional Info](#learn-more)

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jchaiet/quirkstart.git
cd quirkstart
```

### 2. Create a New Sanity Project

1. Go to [Sanity.io](https://www.sanity.io/manage)
2. Create a new project (choose Blank Project).
3. Note your **Project ID** and **Dataset** (usually `production`).

### 3. Create API Tokens

Inside your new Sanity project:

1. Go to **Manage Project → API**.
2. Create two API tokens:
   - **Editor** → Read + Write permissions
   - **Viewer** → Read permissions

### 4. Configure Environment Variables

#### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SANITY_STUDIO_URL="http://localhost:3333"
NEXT_PUBLIC_SANITY_PROJECT_ID="YOUR-SANITY-PROJECT-ID"
NEXT_PUBLIC_SANITY_DATASET="production"

# Webhook secret — generate with: openssl rand -base64 32
SANITY_REVALIDATE_SECRET="YOUR-GENERATED-SECRET"

SANITY_STUDIO_PROJECT_ID="YOUR-SANITY-PROJECT-ID"
SANITY_STUDIO_DATASET="production"
SANITY_STUDIO_API_READ_TOKEN="YOUR-READ-TOKEN"
SANITY_STUDIO_API_READ_WRITE_TOKEN="YOUR-READ-WRITE-TOKEN"

# Email — for form submissions
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@email.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Forms <noreply@yourdomain.com>"
```

#### Studio (`studio/.env`)

```env
SANITY_STUDIO_PROJECT_ID="YOUR-PROJECT-ID"
SANITY_STUDIO_API_READ_WRITE_TOKEN="YOUR-READ-WRITE-TOKEN"
SANITY_STUDIO_API_READ_TOKEN="YOUR-READ-ONLY-TOKEN"
SANITY_STUDIO_PREVIEW_ORIGIN="http://localhost:3000"
```

### 5. Set Up Webhooks

#### On-Demand Revalidation

Keeps page cache fresh when content is published in Sanity.

1. In your Sanity project, go to **API → Webhooks → Create webhook**
2. Fill in:
   - **Name**: `On-Demand Revalidation`
   - **URL**: `https://your-website.com/api/revalidate`
   - **Trigger on**: Create, Update, Delete
   - **HTTP method**: POST
   - **Secret**: generate with `openssl rand -base64 32` — paste into the Secret field and into `SANITY_REVALIDATE_SECRET` in your `.env.local`
3. Add this projection in the webhook payload filter:
   ```
   { "_type": _type, "slug": slug, "locale": locale }
   ```

#### Redirect Deployment (optional)

Triggers a redeploy when redirects are added or changed.

1. Create another webhook:
   - **Name**: `Redirect Deployment`
   - **URL**: your hosting provider's deploy hook (e.g. Vercel deploy hook URL)
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type == "redirect"`

### 6. Customize Your Project

1. In `studio/sanity.config.ts`, update the `title` field to your project name.
2. Update the project name in the root `package.json`.

### 7. Run the Project

```bash
pnpm dev
```

Runs both frontend (`http://localhost:3000`) and studio (`http://localhost:3333`) concurrently.

---

## Getting Started

```bash
pnpm dev
```

| URL                     | Description      |
| ----------------------- | ---------------- |
| `http://localhost:3000` | Next.js frontend |
| `http://localhost:3333` | Sanity Studio    |

---

## Announcements

Announcements are page-level banners that appear above the navigation. They support rich text including bold, italic, and links.

### Creating an Announcement

1. Open any **Page**, **Blog Article**, or **Docs Page** in the Studio.
2. Under the **Details** tab, find the **Announcement** field.
3. Add your announcement text — supports bold, italic, and links.
4. Enable **Apply to child pages** to cascade the announcement to all child pages automatically.
5. Publish.

### Inheritance

- A page with its **own** announcement always shows that one.
- A page with **no** announcement checks its parent. If the parent has an announcement with **Apply to child pages** enabled, that announcement is shown.
- Walks up to 4 levels of the parent chain.

### Dismissal

The announcement includes a close (×) button. Once dismissed, it disappears for that session and reappears on next page load.

### Theming

Announcement colours are controlled via `frontend/lib/theme.ts`:

```ts
announcement: {
  background: "#004a99",
  text: "#ffffff",
  link: "#b3d1ff",
}
```

Both `lightTheme` and `darkTheme` have separate entries.

---

## Redirects

Redirects are managed in Sanity Studio and applied at build time via `next.config.ts`.

### Creating a Redirect

1. Open **Sanity Studio → Redirects → Create new**
2. Fill in:
   - **Source Path** — the old URL, must start with `/`
   - **Destination Page** — select an internal page reference, OR
   - **Destination Path** — enter a manual path or external URL
   - **Permanent** — `true` (301) for permanent moves, `false` (302) for temporary
3. Publish — the site redeploys automatically via the Redirect Deployment webhook

---

## Managing Locales and Translations

Locales are defined in a **single place**: `frontend/lib/i18n.ts`.

### Adding a New Locale

```ts
export const locales = [
  { id: "en-us", title: "English (US)" },
  { id: "es-us", title: "Spanish (US)" },
  { id: "fr-fr", title: "French (France)" }, // ← add here
] as const;
```

The Studio desk structure, locale picker, and frontend routes all update automatically.

### Adding a Translation for an Existing Page

1. Open the document in Sanity Studio.
2. Click **Translations** in the document toolbar.
3. Select the target locale — a new document is created automatically.
4. Translate and publish.

---

## Multi-Site Setup

Each site maps to a hostname in middleware and routes to its own `[site]/[locale]/` path.

### Adding a New Site

1. Navigate to **Sites** in Sanity Studio and create a new document:
   - **Site Title** — human-readable name
   - **Identifier** — unique slug matching `[site]` in the folder structure
   - **Primary Domain** — canonical domain
   - **Default Locale** — fallback locale
2. Publish.

### Local Development for a Specific Site

```json
"scripts": {
  "dev:mybrand": "SITE_ID=my-brand concurrently \"npm run dev:frontend\" \"npm run dev:studio\""
}
```

```bash
pnpm dev:mybrand
```

---

## Forms

Forms are fully Sanity-driven. Editors build forms by adding a **Form Block** to any page's page builder.

### Form Block Features

- Multi-step forms with progress indicator
- 14 field types: text, email, phone, number, URL, textarea, select, multi-select, checkbox, checkbox group, radio group, date picker, range/slider, hidden
- Per-field validation (required, min/max length, pattern)
- Half-width and third-width field layout
- Form width: Small / Medium / Large / Full
- Success message or redirect after submission

### Submission Destinations

| Type      | Description                                      |
| --------- | ------------------------------------------------ |
| `email`   | Sends form data as an HTML email via SMTP        |
| `webhook` | POSTs JSON payload to a URL (Zapier, Make, etc.) |
| `both`    | Sends email AND webhook                          |

### Email Setup

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
SMTP_FROM="Forms <noreply@yourdomain.com>"
```

```bash
cd frontend && pnpm add nodemailer && pnpm add -D @types/nodemailer
```

### Rate Limiting

All API routes are rate limited via `frontend/lib/rateLimit.ts`:

| Route              | Limit         |
| ------------------ | ------------- |
| `/api/form-submit` | 5 req/min/IP  |
| `/api/search`      | 30 req/min/IP |
| `/api/articles`    | 30 req/min/IP |
| `/api/helpful`     | 10 req/min/IP |

Uses in-memory storage. For multi-instance deployments, replace with [Upstash Redis](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview).

---

## Singletons

Singletons are reusable content blocks. When the singleton is updated, it updates everywhere it's used.

### Creating a Singleton

1. Navigate to **Singletons** in the Studio desk.
2. Set **Title**, **Identifier**, **Block Type**, and **Block Content**.
3. Publish.

### Using a Singleton on a Page

1. In any page builder, add a **Singleton Block**.
2. Select the singleton document.
3. Publish.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [QuirkUI Component Library](#) _(internal)_

# LUMAA Landing Page: Developer Handoff

## What is included

This repository contains a responsive React 19 and Tailwind 4 implementation of the approved LUMAA landing page. It includes live typography and layout, responsive hero and image collage, accessible Moments carousel, data cards with linked sources, four LUMAA properties, founder section, mailing-list form, and a moderated Moment-submission modal.

The landing page is intentionally built as a static frontend. No private service keys are stored in the browser.

## Run locally

```bash
pnpm install
pnpm dev
```

Production validation:

```bash
pnpm check
pnpm build
```

## Content source of truth

Edit all photography paths, Moments, statistics, source URLs, properties, domain, social links, and form endpoints in:

```text
client/src/content.ts
```

The exact approved long-form copy and implementation rules are also documented at the project root in:

```text
FINAL_IMPLEMENTATION_BRIEF.md
```

## Photography

The code currently uses branded visual placeholders so no unlicensed or provisional AI portraits are shipped accidentally. Once approved images are licensed:

1. Upload the optimized source files to the production CDN or hosting storage.
2. Add the resulting URLs to `media` and each Moment object in `client/src/content.ts`.
3. Preserve meaningful alt text.
4. Use portrait-oriented images with enough crop tolerance for mobile and desktop.
5. Export WebP or AVIF variants when the hosting stack supports responsive image generation.

If this project remains on Manus hosting, upload local assets with:

```bash
manus-upload-file --webdev /path/to/photo.jpg
```

Then use the returned `/manus-storage/...` path in `client/src/content.ts`.

## Forms: two viable production paths

| Approach | Tradeoffs | Cost | Setup complexity |
|---|---|---:|---:|
| Public form endpoint such as Formspree, Basin, or a mailing-list provider form action | Fastest option. Works with the existing static site. Provider handles delivery and spam controls. | Provider dependent, often free to start | Low |
| Server or serverless form handlers owned by the developer | Best control over moderation, consent records, CRM routing, and privacy. Requires secure server-side secrets and logging. | Hosting dependent | Medium |

The current code supports either route through these environment variables:

```bash
VITE_NEWSLETTER_ACTION_URL=https://your-public-endpoint.example/newsletter
VITE_MOMENT_ACTION_URL=https://your-public-endpoint.example/moments
```

If the chosen provider needs a private API key, do not put it in a `VITE_` variable. Route the payload through a server or serverless function instead.

With no endpoints configured, both forms run in demo mode, validate input, show success feedback, and print the payload to the browser console. This makes the complete interaction reviewable without sending data anywhere.

## Approved launch architecture: Cloudflare capture, no additional app

Use **Cloudflare Pages or Workers + D1** as the initial audience-capture system. This keeps the website, forms, storage, DNS, TLS, and anti-spam controls inside the Cloudflare account already associated with `wearelumaa.com`. No separate inbox, CRM, or email-marketing application is required to begin collecting records.

The complete standalone build specification is in `CLOUDFLARE_FORM_CAPTURE_SPEC.md` at the project root. Give that file directly to the developer responsible for Cloudflare deployment.

Create two same-origin endpoints:

| Endpoint | Purpose | Successful response |
|---|---|---|
| `POST /api/join` | Validate and store a LUMAA mailing-list signup. | `201` with `{ "ok": true }` |
| `POST /api/moments` | Validate and store a moderated Moment submission. | `201` with `{ "ok": true, "status": "pending" }` |

Set the frontend production variables to these routes:

```bash
VITE_NEWSLETTER_ACTION_URL=/api/join
VITE_MOMENT_ACTION_URL=/api/moments
```

### D1 schema

```sql
CREATE TABLE subscribers (
  id TEXT PRIMARY KEY,
  first_name TEXT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  interest TEXT NOT NULL DEFAULT 'general',
  consent_text_version TEXT NOT NULL,
  consented_at TEXT NOT NULL,
  signup_source TEXT NOT NULL DEFAULT 'website',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX subscribers_interest_idx ON subscribers (interest);
CREATE INDEX subscribers_created_at_idx ON subscribers (created_at);

CREATE TABLE moments (
  id TEXT PRIMARY KEY,
  moment_text TEXT NOT NULL,
  first_name TEXT,
  email TEXT,
  publish_anonymously INTEGER NOT NULL DEFAULT 1,
  marketing_consent INTEGER NOT NULL DEFAULT 0,
  consent_text_version TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TEXT NOT NULL
);

CREATE INDEX moments_status_idx ON moments (moderation_status);
CREATE INDEX moments_submitted_at_idx ON moments (submitted_at);
```

For `/api/join`, trim `firstName`, lowercase and trim `email`, allow only the known interest values (`general`, `midicon`, `power-index`, `load-off`, `collection`), record the displayed consent-language version, and upsert by normalized email rather than creating duplicates. Preserve the earliest consent timestamp and update the latest interest and name only when a new value is supplied.

For `/api/moments`, enforce the 300-character limit, default `publish_anonymously` to true, and always create the record with `moderation_status = 'pending'`. Never render a submission publicly from this endpoint. If `marketingConsent` is true and an email is supplied, separately upsert the person into `subscribers`; otherwise the optional Moment email must not become a mailing-list subscriber.

### Security and operations

Use prepared D1 statements, strict server-side validation, JSON body-size limits, generic success responses, and rate limiting. Add Cloudflare Turnstile before public launch if spam appears; validate the Turnstile token inside the Worker, never in the browser alone. Do not store raw IP addresses. If abuse analysis requires a network signal, store only a short-lived salted hash and document the retention period.

Provide the owner with two saved D1 queries or equivalent dashboard instructions: one to export subscribers as CSV-compatible rows and one to review pending Moments. Do not send an automatic email from the form at launch. Cloudflare stores the records; a newsletter sender can be connected later when LUMAA is ready to send campaigns, welcome sequences, and unsubscribe-managed communications.

### Required Cloudflare configuration

1. Create the D1 database and run the schema above.
2. Bind the database to the Pages or Worker project as `DB`.
3. Deploy the two route handlers with the site.
4. Set the two frontend action URLs to the same-origin API routes.
5. Verify valid, invalid, duplicate, and rate-limited submissions in production.
6. Confirm records in D1 and test export before opening the form publicly.

## Moment-submission privacy behavior

The modal implements the approved requirements:

- Moment text is required and limited to 300 characters.
- Anonymous publication is selected by default.
- First name and email are optional.
- Marketing consent is a separate unchecked choice.
- The interface states that submissions are moderated.
- No submission is automatically displayed publicly.

Production storage must keep email addresses private and separate submission consent from newsletter consent.

## Newsletter interest tracking

Clicking **Join for updates** on a property scrolls to the main LUMAA form and adds an `interest` value to the submission payload:

```text
midicon
power-index
load-off
collection
```

This allows one primary LUMAA list to retain property interests without creating fragmented signup forms.

The primary **Join LUMAA** form collects `firstName` and `email`. Map `firstName` to the provider’s first-name or given-name field and `email` to the subscriber address. The `interest` value should be stored as a tag, group, or custom field rather than creating separate lists. The Moment-submission form also has optional first-name and email fields, but those should remain separate from the mailing list unless the person checks the explicit marketing-consent box.

## Domain and links

The approved canonical domain is:

```text
https://www.wearelumaa.com
```

The domain has been added to `siteConfig`, the canonical link, and Open Graph metadata. The code uses `www` as canonical; configure the apex host `wearelumaa.com` to redirect permanently to `https://www.wearelumaa.com`.

Before launch, update `siteConfig` in `client/src/content.ts` with:

- Instagram URL
- LinkedIn URL

### Cloudflare deployment options

| Approach | Tradeoffs | Cost | Setup complexity |
|---|---|---:|---:|
| Cloudflare Pages | Direct static deployment, automatic TLS, preview builds, and the simplest fit for this codebase. Configure build command `pnpm build` and output directory `dist/public`. | Cloudflare plan dependent; commonly free to start | Low |
| Existing production host behind Cloudflare DNS | Keep the developer’s current hosting platform and use Cloudflare for DNS, proxying, TLS, and redirects. Requires the host’s target CNAME or IP. | Host dependent | Medium |

Do not change the live DNS records until the chosen host has a verified production deployment. Once ready, attach `www.wearelumaa.com`, enable TLS with **Full (strict)** mode when the origin supports it, verify the certificate, and then add a permanent apex-to-`www` redirect.

## Trademark treatment

Render the brand wordmark as **LUMAA™** in the header, footer, page title, Open Graph title, social share card, and first prominent brand reference. Use plain **LUMAA** in ordinary body copy after the first prominent use; the symbol does not need to appear every time the name is repeated. Do not append the symbol to the domain, URLs, email addresses, file names, hashtags, or code identifiers.

The trademark symbol should be smaller than the wordmark, aligned to the upper right, and remain legible at mobile sizes. Accessibility text should announce “trademark.” Replace `™` with `®` only after the registration has issued and the trademark owner confirms registered-symbol use.

## Text-message and social link previews

The page head includes a canonical URL, shareable meta description, Open Graph title and description, Twitter card tags, image dimensions, image type, and image alt text. These tags support previews in iMessage, Messages on Android, WhatsApp, Slack, LinkedIn, Facebook, and other clients that read Open Graph metadata.

The finished 1200 by 630 preview asset is:

```text
/home/ubuntu/webdev-static-assets/lumaa-social-share.png
```

Place that exact file at the public production URL:

```text
https://www.wearelumaa.com/social-share.png
```

The URL must return the PNG directly with status `200`, no login, no robots block, no HTML wrapper, and an `image/png` content type. The Open Graph and Twitter tags already reference that absolute URL.

After deployment, purge the Cloudflare cache for the page and image, then re-scrape the URL with platform link-preview inspectors. Messaging clients cache previews aggressively, so a previously sent link may continue showing the earlier card even after the metadata is corrected; use a query string such as `?v=2` only for testing, not as the canonical URL.

## Source links

Each statistic links directly to the approved source in a new browser tab. The sources are centralized in `client/src/content.ts` so future claims can be revised without editing page markup.

## Accessibility included

- Semantic headings and landmarks
- Skip-to-content link
- Keyboard-accessible navigation and carousel controls
- Visible focus states
- Escape-key support for the submission modal
- Form labels and error feedback
- Reduced-motion support
- External-source screen-reader notices
- Mobile menu with state announcement

## Primary files

| File | Responsibility |
|---|---|
| `client/src/pages/Home.tsx` | Page sections, carousel, modal, forms, and navigation |
| `client/src/content.ts` | Copy, data, citations, image URLs, social links, form endpoints |
| `client/src/index.css` | Responsive editorial design system |
| `client/src/lib/forms.ts` | Static-site form integration boundary |
| `client/src/App.tsx` | App route and shared providers |
| `client/index.html` | Metadata and font loading |

## Launch checklist

- Replace every licensed-image placeholder.
- Add the approved Kedma portrait.
- Add the final LUMAA domain and social URLs.
- Connect the newsletter form.
- Connect the Moment-submission workflow and moderation destination.
- Review privacy language with the final data processor.
- Test all source links and social links.
- Run keyboard and mobile QA.
- Run `pnpm check` and `pnpm build`.

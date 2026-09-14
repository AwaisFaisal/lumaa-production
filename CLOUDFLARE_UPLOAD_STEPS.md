# LUMAA Cloudflare Upload Steps

These steps deploy the existing React site plus the new same-origin Pages Functions:

- `POST /api/join`
- `POST /api/moments`

Use the client owner's Cloudflare account. Do not deploy production-only resources under your personal account.

## Files Added For Cloudflare

| File | Purpose |
|---|---|
| `functions/api/join.js` | Handles newsletter signups and writes to D1. |
| `functions/api/moments.js` | Handles Moment submissions and writes pending records to D1. |
| `functions/_shared/lumaa-forms.js` | Shared validation, JSON parsing, consent versions, and subscriber upsert helper. |
| `schema.sql` | D1 schema for `subscribers` and `moments`. |
| `wrangler.example.jsonc` | Template Cloudflare Pages config with the `DB` binding placeholder. |
| `client/public/_routes.json` | Limits Pages Function invocation to `/api/*`. |

## Option A: Deploy With Wrangler

Run these from the `code` folder.

### 1. Log in

```bash
npx wrangler login
```

### 2. Create the D1 database

```bash
npx wrangler d1 create lumaa-production
```

Cloudflare will print a block similar to:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "lumaa-production",
      "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  ]
}
```

Copy the `database_id`.

### 3. Create the real Wrangler config

Copy `wrangler.example.jsonc` to `wrangler.jsonc`.

In `wrangler.jsonc`, replace:

```text
REPLACE_WITH_D1_DATABASE_ID
```

with the actual D1 `database_id` from Cloudflare.

The binding name must stay:

```text
DB
```

### 4. Apply the schema

```bash
npx wrangler d1 execute lumaa-production --remote --file ./schema.sql
```

### 5. Set production frontend variables

In Cloudflare Pages, set these environment variables for production:

```bash
VITE_NEWSLETTER_ACTION_URL=/api/join
VITE_MOMENT_ACTION_URL=/api/moments
```

If you deploy through Wrangler only, also place them in the Pages project settings in the Cloudflare dashboard so future builds keep using the API routes.

### 6. Build

```bash
pnpm install
pnpm check
pnpm build
```

### 7. Deploy

From the `code` folder, where the `functions` folder exists:

```bash
npx wrangler pages deploy
```

If Cloudflare asks for the Pages project name, use:

```text
lumaa-landing-page
```

You can also pass it directly:

```bash
npx wrangler pages deploy --project-name lumaa-landing-page
```

Wrangler will upload `dist/public` from the Pages config and include the `functions` folder.

## Option B: Deploy With Cloudflare Pages Git Integration

This is the smoother long-term setup.

1. Push this `code` folder to the repository the client wants Cloudflare Pages to deploy.
2. In Cloudflare, go to **Workers & Pages**.
3. Create or open the Pages project.
4. Connect the repository.
5. Set the project root to `code` if the repository contains the outer delivery folder.
6. Set build command:

```bash
pnpm build
```

7. Set build output directory:

```text
dist/public
```

8. Set production environment variables:

```bash
VITE_NEWSLETTER_ACTION_URL=/api/join
VITE_MOMENT_ACTION_URL=/api/moments
```

9. Add a D1 binding named `DB` to the `lumaa-production` database.
10. Deploy the project.

The `functions` folder must be at the Pages project root. If the Cloudflare project root is `code`, the correct path is:

```text
code/functions
```

## Create The D1 Database In The Dashboard

If you prefer the dashboard instead of Wrangler:

1. Log into the client's Cloudflare account.
2. Open **Workers & Pages** or **Storage & Databases > D1 SQL Database**.
3. Create a database named:

```text
lumaa-production
```

4. Open the database console.
5. Paste and run the contents of `schema.sql`.
6. Open the LUMAA Pages project.
7. Go to **Settings > Bindings**.
8. Add a **D1 database binding**.
9. Set variable name:

```text
DB
```

10. Select the `lumaa-production` database.
11. Redeploy the Pages project so the binding takes effect.

## Domain Setup

After the deployment works on the Cloudflare Pages preview URL:

1. Add `www.wearelumaa.com` as the custom domain.
2. Set it as the canonical production host.
3. Create a permanent redirect from `wearelumaa.com` to:

```text
https://www.wearelumaa.com
```

4. Use valid HTTPS/TLS. Prefer **Full (strict)** when the origin supports it.

## Required Rate Limiting

Before launch, add Cloudflare rate limiting rules for:

```text
/api/join
/api/moments
```

Start conservatively, then adjust if real users are blocked. If spam appears, add Cloudflare Turnstile and validate the Turnstile token server-side before writing to D1.

## Smoke Tests

Replace the domain with the Pages preview URL or production domain.

### Valid signup

```bash
curl -i https://www.wearelumaa.com/api/join \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Kedma\",\"email\":\"test@example.com\",\"interest\":\"midicon\"}"
```

Expected:

```json
{"ok":true}
```

### Valid Moment

```bash
curl -i https://www.wearelumaa.com/api/moments \
  -H "Content-Type: application/json" \
  -d "{\"moment\":\"I realized I could begin again without asking permission.\",\"anonymous\":true,\"firstName\":\"\",\"email\":\"\",\"marketingConsent\":false}"
```

Expected:

```json
{"ok":true,"status":"pending"}
```

### Export subscribers

```bash
npx wrangler d1 execute lumaa-production --remote --command "SELECT first_name,email,interest,consent_text_version,consented_at,signup_source,created_at,updated_at FROM subscribers ORDER BY created_at DESC"
```

### Review pending Moments

```bash
npx wrangler d1 execute lumaa-production --remote --command "SELECT id,moment_text,first_name,email,publish_anonymously,marketing_consent,moderation_status,submitted_at FROM moments WHERE moderation_status = 'pending' ORDER BY submitted_at ASC"
```

### Approve a Moment

```bash
npx wrangler d1 execute lumaa-production --remote --command "UPDATE moments SET moderation_status = 'approved' WHERE id = 'PASTE_MOMENT_ID_HERE'"
```

Use `rejected` instead of `approved` when the submission should not be used.

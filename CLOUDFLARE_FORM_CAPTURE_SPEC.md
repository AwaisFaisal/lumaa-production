# LUMAA™ Cloudflare Form Capture Specification

## Purpose

This document is the developer-ready specification for capturing LUMAA website signups and Moment submissions entirely within Cloudflare. The launch architecture uses **Cloudflare Pages or Workers for the API routes** and **Cloudflare D1 for storage**. It does not require a separate inbox, CRM, mailing-list application, or form product to begin collecting records.

Cloudflare will initially **capture, store, review, and export** the audience data. It will not send newsletters, manage automated email sequences, or administer unsubscribe requests. A campaign-sending service can be added later without rebuilding the website forms.

## Architecture

| Component | Responsibility |
|---|---|
| LUMAA React website | Collects first name, email, interests, Moment text, and consent choices. |
| `POST /api/join` | Validates and stores LUMAA mailing-list signups. |
| `POST /api/moments` | Validates and stores moderated Moment submissions. |
| Cloudflare D1 | Stores subscribers and Moments in separate tables. |
| Cloudflare Turnstile | Optional launch or post-launch spam protection. |
| Cloudflare dashboard or SQL export | Lets the owner review and export records. |

Keep both endpoints on the same `www.wearelumaa.com` origin. This avoids cross-origin configuration and keeps the browser-facing implementation simple.

## Frontend configuration

The existing React site already sends JSON through its form helper. Configure these production environment variables:

```bash
VITE_NEWSLETTER_ACTION_URL=/api/join
VITE_MOMENT_ACTION_URL=/api/moments
```

No private secret may appear in a `VITE_` variable. All D1 bindings, Turnstile secrets, and administrative credentials stay server-side in Cloudflare.

## D1 database schema

Create a D1 database for LUMAA and run this schema:

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

CREATE INDEX subscribers_interest_idx
  ON subscribers (interest);

CREATE INDEX subscribers_created_at_idx
  ON subscribers (created_at);

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

CREATE INDEX moments_status_idx
  ON moments (moderation_status);

CREATE INDEX moments_submitted_at_idx
  ON moments (submitted_at);
```

Bind the database to the Cloudflare Pages or Worker project using the binding name:

```text
DB
```

## Endpoint 1: Join LUMAA

### Route

```text
POST /api/join
```

### Request body

```json
{
  "firstName": "Kedma",
  "email": "name@example.com",
  "interest": "power-index",
  "submittedAt": "2026-09-13T03:30:39.000Z"
}
```

### Allowed interests

```text
general
midicon
power-index
load-off
collection
```

Reject or replace any unknown value with `general`. Do not write arbitrary client-supplied tags into the database.

### Server-side behavior

1. Require a JSON `POST` request.
2. Reject bodies larger than the chosen small form limit, such as 16 KB.
3. Trim `firstName` and enforce a reasonable maximum, such as 80 characters.
4. Trim and lowercase `email`.
5. Validate the normalized email server-side.
6. Generate the record ID server-side with `crypto.randomUUID()`.
7. Set `consent_text_version` to a server-controlled value such as `join-v1-2026-09`.
8. Set `consented_at`, `created_at`, and `updated_at` on the server in UTC.
9. Upsert by normalized email instead of creating duplicates.
10. Preserve the original `created_at` and earliest consent record; update the name and latest interest only when new values are supplied.
11. Return a generic response that does not reveal whether an address was already stored.

### Successful response

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "ok": true
}
```

## Endpoint 2: Share Your Moment

### Route

```text
POST /api/moments
```

### Request body

```json
{
  "moment": "I realized I could begin again without asking anyone for permission.",
  "anonymous": true,
  "firstName": "",
  "email": "",
  "marketingConsent": false,
  "submittedAt": "2026-09-13T03:28:47.000Z"
}
```

### Server-side behavior

1. Require `moment` and trim it.
2. Reject submissions shorter than 10 characters or longer than 300 characters.
3. Trim the optional first name and email.
4. Validate the email only when one is supplied.
5. Default `publish_anonymously` to true.
6. Store marketing consent as false unless the explicit checkbox value is true.
7. Generate the ID and timestamp server-side.
8. Always create the record with `moderation_status = 'pending'`.
9. Never publish a Moment automatically from this endpoint.
10. Never expose the contributor’s email publicly.
11. If `marketingConsent` is true and a valid email is supplied, separately upsert the person into `subscribers` using an interest such as `moments` only if that value is added to the allowed-interest list. Otherwise use `general` and store the signup source as `moment-form`.
12. If marketing consent is false, the optional Moment email must remain only in the private `moments` record.

### Successful response

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "ok": true,
  "status": "pending"
}
```

## Error responses

Return concise JSON errors without internal implementation details:

```json
{
  "ok": false,
  "error": "invalid_submission"
}
```

Recommended status codes are:

| Status | Use |
|---:|---|
| `400` | Malformed JSON or missing required fields. |
| `405` | Method other than `POST`. |
| `413` | Request body is too large. |
| `422` | Field validation failed. |
| `429` | Rate limit exceeded. |
| `500` | Unexpected server error. Log privately; return a generic public message. |

## Consent rules

The Join LUMAA form is an explicit mailing-list action. Store the version of the language displayed at signup and the server timestamp.

The Moment form has two separate purposes: submitting a story and optionally joining LUMAA. The marketing checkbox must remain unchecked by default. A submitted Moment does not create a mailing-list record unless that checkbox is explicitly selected.

Do not merge the two consent events. Keep the displayed consent-language version with every mailing-list record so LUMAA can later identify what the person agreed to.

## Security requirements

Use prepared D1 statements for every query. Validate all fields again inside the Worker even though the browser also validates them. Keep the endpoints same-origin and do not enable broad CORS. Set a small body limit and generic error responses.

Apply Cloudflare rate limiting to both routes. If spam appears, add Cloudflare Turnstile and validate the token server-side using the Turnstile secret. Do not trust a browser-only Turnstile result.

Do not store raw IP addresses. If a temporary abuse-prevention signal is required, use a short-lived salted hash, document its purpose and retention period, and remove it when no longer necessary.

## Owner access and exports

The owner should be given repeatable instructions for the following D1 queries.

### Export subscribers

```sql
SELECT
  first_name,
  email,
  interest,
  consent_text_version,
  consented_at,
  signup_source,
  created_at,
  updated_at
FROM subscribers
ORDER BY created_at DESC;
```

### Review pending Moments

```sql
SELECT
  id,
  moment_text,
  first_name,
  email,
  publish_anonymously,
  marketing_consent,
  moderation_status,
  submitted_at
FROM moments
WHERE moderation_status = 'pending'
ORDER BY submitted_at ASC;
```

### Approve or reject a Moment

```sql
UPDATE moments
SET moderation_status = 'approved'
WHERE id = ?;
```

Use `rejected` instead of `approved` when the submission will not be used. The developer should use a prepared parameter rather than inserting the ID directly into SQL.

## Minimum acceptance tests

| Test | Expected result |
|---|---|
| Valid first name and email | One subscriber is stored and `201` is returned. |
| Duplicate email with a new interest | Existing subscriber is updated; no duplicate is created. |
| Invalid email | Nothing is stored and `422` is returned. |
| Unknown interest | Value is rejected or safely normalized to `general`. |
| Valid anonymous Moment | Private pending Moment is stored without a subscriber record. |
| Moment with marketing consent | Pending Moment is stored and subscriber is separately upserted. |
| Moment without marketing consent | No subscriber record is created. |
| Moment over 300 characters | Nothing is stored and `422` is returned. |
| Repeated automated submissions | Rate limiting or Turnstile challenge applies. |
| D1 export | Owner can retrieve names, emails, interests, and consent fields. |

## Launch checklist

| Requirement | Status before launch |
|---|---|
| D1 database created | Required |
| Schema applied | Required |
| `DB` binding configured | Required |
| `/api/join` deployed | Required |
| `/api/moments` deployed | Required |
| Frontend action URLs configured | Required |
| Production submissions tested | Required |
| D1 records verified | Required |
| Subscriber export tested | Required |
| Pending-Moment review tested | Required |
| Rate limiting enabled | Required |
| Turnstile | Recommended when spam risk warrants it |

## Official Cloudflare references

- [Create an HTML form with Cloudflare Pages and Workers](https://developers.cloudflare.com/pages/tutorials/forms/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)

## Files already prepared

The LUMAA frontend integration boundary is implemented in:

```text
client/src/lib/forms.ts
```

The two endpoint variables are defined in:

```text
client/src/content.ts
```

The developer must add the Cloudflare API handlers and D1 binding during deployment. The current preview remains in safe demo mode until the two endpoint variables are configured.

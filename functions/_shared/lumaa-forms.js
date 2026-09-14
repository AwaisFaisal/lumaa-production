export const JOIN_CONSENT_VERSION = "join-v1-2026-09";
export const MOMENT_CONSENT_VERSION = "moment-v1-2026-09";
export const MAX_BODY_BYTES = 16 * 1024;

export const ALLOWED_INTERESTS = new Set([
  "general",
  "midicon",
  "power-index",
  "load-off",
  "collection",
]);

export function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export function methodNotAllowed() {
  return jsonResponse({ ok: false, error: "method_not_allowed" }, 405);
}

export function invalidSubmission(status = 422) {
  return jsonResponse({ ok: false, error: "invalid_submission" }, status);
}

export async function readJsonBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { error: "invalid_content_type" };
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return { error: "too_large" };
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return { error: "invalid_body" };
  }

  let received = 0;
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      return { error: "too_large" };
    }

    chunks.push(value);
  }

  try {
    const body = new TextDecoder().decode(concatChunks(chunks, received));
    return { data: JSON.parse(body) };
  } catch {
    return { error: "invalid_json" };
  }
}

export function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function normalizeEmail(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export function normalizeInterest(value) {
  if (typeof value !== "string") return "general";
  return ALLOWED_INTERESTS.has(value) ? value : "general";
}

export async function upsertSubscriber(db, { firstName, email, interest, signupSource, now }) {
  const id = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO subscribers (
        id,
        first_name,
        email,
        interest,
        consent_text_version,
        consented_at,
        signup_source,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        first_name = COALESCE(NULLIF(excluded.first_name, ''), subscribers.first_name),
        interest = excluded.interest,
        updated_at = excluded.updated_at`,
    )
    .bind(
      id,
      firstName,
      email,
      interest,
      JOIN_CONSENT_VERSION,
      now,
      signupSource,
      now,
      now,
    )
    .run();
}

function concatChunks(chunks, size) {
  const buffer = new Uint8Array(size);
  let offset = 0;

  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return buffer;
}

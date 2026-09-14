import {
  cleanText,
  invalidSubmission,
  isValidEmail,
  jsonResponse,
  methodNotAllowed,
  MOMENT_CONSENT_VERSION,
  normalizeEmail,
  readJsonBody,
  upsertSubscriber,
} from "../_shared/lumaa-forms.js";

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  if (!env.DB) {
    console.error("Missing D1 binding: DB");
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }

  const parsed = await readJsonBody(request);
  if (parsed.error === "too_large") {
    return jsonResponse({ ok: false, error: "invalid_submission" }, 413);
  }
  if (parsed.error || !parsed.data || typeof parsed.data !== "object") {
    return invalidSubmission(400);
  }

  const moment = cleanText(parsed.data.moment, 301);
  const firstName = cleanText(parsed.data.firstName, 80);
  const email = normalizeEmail(parsed.data.email);
  const publishAnonymously = parsed.data.anonymous !== false ? 1 : 0;
  const marketingConsent = parsed.data.marketingConsent === true ? 1 : 0;

  if (moment.length < 10 || moment.length > 300) {
    return invalidSubmission();
  }

  if (email && !isValidEmail(email)) {
    return invalidSubmission();
  }

  const now = new Date().toISOString();

  try {
    await env.DB.batch([
      env.DB
        .prepare(
          `INSERT INTO moments (
            id,
            moment_text,
            first_name,
            email,
            publish_anonymously,
            marketing_consent,
            consent_text_version,
            moderation_status,
            submitted_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
        )
        .bind(
          crypto.randomUUID(),
          moment,
          firstName,
          email || null,
          publishAnonymously,
          marketingConsent,
          marketingConsent ? MOMENT_CONSENT_VERSION : null,
          now,
        ),
    ]);

    if (marketingConsent && email) {
      await upsertSubscriber(env.DB, {
        firstName,
        email,
        interest: "general",
        signupSource: "moment-form",
        now,
      });
    }

    return jsonResponse({ ok: true, status: "pending" }, 201);
  } catch (error) {
    console.error("Moment form write failed", error);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

import {
  cleanText,
  invalidSubmission,
  isValidEmail,
  jsonResponse,
  methodNotAllowed,
  normalizeEmail,
  normalizeInterest,
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

  const firstName = cleanText(parsed.data.firstName, 80);
  const email = normalizeEmail(parsed.data.email);
  const interest = normalizeInterest(parsed.data.interest);

  if (!isValidEmail(email)) {
    return invalidSubmission();
  }

  try {
    await upsertSubscriber(env.DB, {
      firstName,
      email,
      interest,
      signupSource: "website",
      now: new Date().toISOString(),
    });

    return jsonResponse({ ok: true }, 201);
  } catch (error) {
    console.error("Join form write failed", error);
    return jsonResponse({ ok: false, error: "server_error" }, 500);
  }
}

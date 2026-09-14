export type FormResult = {
  ok: boolean;
  demo: boolean;
  message: string;
};

/**
 * Posts form data to a public form endpoint when configured.
 * Static sites cannot safely contain secret API keys. For services requiring
 * secrets, route this payload through the developer's server or serverless function.
 */
export async function submitPublicForm(
  endpoint: string,
  payload: Record<string, unknown>,
): Promise<FormResult> {
  if (!endpoint) {
    console.info("LUMAA form demo payload", payload);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    return {
      ok: true,
      demo: true,
      message: "Demo received. Connect the production form endpoint before launch.",
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("The form could not be submitted. Please try again.");
  }

  return {
    ok: true,
    demo: false,
    message: "Thank you. You’re in the room.",
  };
}

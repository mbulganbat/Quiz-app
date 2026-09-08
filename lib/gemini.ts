const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash"

const MAX_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 800

type GenerateOptions = {
  prompt: string
  json?: boolean
}

/** Carries the upstream HTTP status so routes can map it to their own reply. */
export class GeminiError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message)
    this.name = "GeminiError"
  }
}

/** Rate limits and upstream hiccups are worth another attempt; 4xx are not. */
function isRetryable(status: number) {
  return status === 429 || status >= 500
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Calls the Gemini REST API directly so the app does not need an extra SDK.
 * Requires GEMINI_API_KEY in the environment.
 */
export async function generate({ prompt, json = false }: GenerateOptions) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new GeminiError("GEMINI_API_KEY is not set")
  }

  let lastError: GeminiError | undefined

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let response: Response

    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: json
              ? { responseMimeType: "application/json", temperature: 0.4 }
              : { temperature: 0.4 },
          }),
        }
      )
    } catch (caught) {
      lastError = new GeminiError(`Gemini request failed: ${String(caught)}`)

      if (attempt < MAX_ATTEMPTS) {
        await wait(RETRY_BASE_DELAY_MS * attempt)
        continue
      }

      throw lastError
    }

    if (!response.ok) {
      lastError = new GeminiError(
        `Gemini request failed (${response.status}): ${await response.text()}`,
        response.status
      )

      if (attempt < MAX_ATTEMPTS && isRetryable(response.status)) {
        await wait(RETRY_BASE_DELAY_MS * attempt)
        continue
      }

      throw lastError
    }

    const data = await response.json()
    const text: string = (data?.candidates?.[0]?.content?.parts ?? [])
      .filter((part: { thought?: boolean }) => !part.thought)
      .map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim()

    if (text) {
      return text
    }

    lastError = new GeminiError("Gemini returned an empty response")

    if (attempt < MAX_ATTEMPTS) {
      await wait(RETRY_BASE_DELAY_MS * attempt)
      continue
    }
  }

  throw lastError ?? new GeminiError("Gemini request failed")
}

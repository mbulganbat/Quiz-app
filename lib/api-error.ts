import { GeminiError } from "@/lib/gemini"

type Failure = {
  error: string
  status: number
}

/**
 * Turns an upstream failure into a reply the UI can show verbatim, so a
 * transient outage is not indistinguishable from a broken deployment.
 */
export function failureResponse(error: unknown, fallback: string): Failure {
  if (!(error instanceof GeminiError)) {
    return { error: fallback, status: 502 }
  }

  if (error.status === 429) {
    return {
      error: "The AI service is rate limited right now. Try again in a moment.",
      status: 429,
    }
  }

  if (error.status === 401 || error.status === 403) {
    return {
      error: "The AI service rejected the API key.",
      status: 502,
    }
  }

  if (error.message.includes("GEMINI_API_KEY is not set")) {
    return {
      error: "The server is missing its GEMINI_API_KEY.",
      status: 500,
    }
  }

  return { error: fallback, status: 502 }
}

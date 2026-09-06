const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash"

type GenerateOptions = {
  prompt: string
  json?: boolean
}

/**
 * Calls the Gemini REST API directly so the app does not need an extra SDK.
 * Requires GEMINI_API_KEY in the environment.
 */
export async function generate({ prompt, json = false }: GenerateOptions) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set")
  }

  const response = await fetch(
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

  if (!response.ok) {
    throw new Error(
      `Gemini request failed (${response.status}): ${await response.text()}`
    )
  }

  const data = await response.json()
  const text: string = (data?.candidates?.[0]?.content?.parts ?? [])
    .filter((part: { thought?: boolean }) => !part.thought)
    .map((part: { text?: string }) => part.text ?? "")
    .join("")
    .trim()

  if (!text) {
    throw new Error("Gemini returned an empty response")
  }

  return text
}

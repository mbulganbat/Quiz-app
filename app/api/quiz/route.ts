import { auth } from "@clerk/nextjs/server"

import { failureResponse } from "@/lib/api-error"
import { generate } from "@/lib/gemini"
import type { QuizQuestion } from "@/lib/types"

const QUESTION_COUNT = 5

function parseQuiz(raw: string): QuizQuestion[] {
  const parsed: unknown = JSON.parse(raw)
  const list = Array.isArray(parsed)
    ? parsed
    : (parsed as { questions?: unknown })?.questions

  if (!Array.isArray(list)) {
    throw new Error("Quiz response is not a list of questions")
  }

  const questions = list.slice(0, QUESTION_COUNT).map((item) => {
    const { question, options, correctAnswer } = item as Record<string, unknown>

    if (
      typeof question !== "string" ||
      !Array.isArray(options) ||
      options.length !== 4 ||
      !options.every((option) => typeof option === "string") ||
      typeof correctAnswer !== "string" ||
      !options.includes(correctAnswer)
    ) {
      throw new Error("Quiz response has an unexpected shape")
    }

    return { question, options: options as string[], correctAnswer }
  })

  if (questions.length === 0) {
    throw new Error("Quiz response is empty")
  }

  return questions
}

export const maxDuration = 60

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { title?: unknown; content?: unknown }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const title = typeof body.title === "string" ? body.title.trim() : ""
  const content = typeof body.content === "string" ? body.content.trim() : ""

  if (!content) {
    return Response.json({ error: "'content' is required" }, { status: 400 })
  }

  try {
    const raw = await generate({
      json: true,
      prompt: [
        `Write ${QUESTION_COUNT} multiple choice questions about the article below.`,
        "Each question must have exactly 4 options and one correct answer.",
        "The correct answer must be one of the options, copied word for word.",
        "Use the same language as the article.",
        'Return JSON only: [{"question": string, "options": [string, string, string, string], "correctAnswer": string}]',
        "",
        `Title: ${title}`,
        "Article:",
        content,
      ].join("\n"),
    })

    return Response.json({ questions: parseQuiz(raw) })
  } catch (error) {
    console.error("Failed to generate quiz", error)

    const { error: message, status } = failureResponse(
      error,
      "Failed to generate the quiz"
    )

    return Response.json({ error: message }, { status })
  }
}

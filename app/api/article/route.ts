import { generate } from "@/lib/gemini"

export async function POST(request: Request) {
  let body: { title?: unknown; content?: unknown }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const title = typeof body.title === "string" ? body.title.trim() : ""
  const content = typeof body.content === "string" ? body.content.trim() : ""

  if (!title || !content) {
    return Response.json(
      { error: "Both 'title' and 'content' are required" },
      { status: 400 }
    )
  }

  try {
    const summary = await generate({
      prompt: [
        "Summarize the article below in 4-6 sentences.",
        "Keep the summary in the same language as the article.",
        "Return only the summary text, without a heading or any markdown.",
        "",
        `Title: ${title}`,
        "Article:",
        content,
      ].join("\n"),
    })

    return Response.json({ title, content, summary })
  } catch (error) {
    console.error("Failed to summarize article", error)
    return Response.json(
      { error: "Failed to summarize the article" },
      { status: 502 }
    )
  }
}

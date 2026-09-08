"use client"

import { useState } from "react"
import axios from "axios"
import { ChevronLeftIcon } from "lucide-react"

import { AppHeader } from "@/components/AppHeader"
import { AppSidebar } from "@/components/AppSideBar"
import { ArticleForm } from "@/components/ArticleForm"
import { ArticleSummary } from "@/components/ArticleSummary"
import { GeneratingCard } from "@/components/GeneratingCard"
import { Quiz } from "@/components/Quiz"
import { Button } from "@/components/ui/button"
import { useArticles } from "@/hooks/use-articles"
import type { Article, QuizQuestion } from "@/lib/types"

type View = "form" | "summary" | "quiz"

const SUMMARY_STEPS = [
  "Reading your article…",
  "Writing the summary…",
  "Almost done…",
  "Still working — this can take up to a minute.",
]

const QUIZ_STEPS = [
  "Reading your article…",
  "Writing the questions…",
  "Checking the answers…",
  "Still working — this can take up to a minute.",
]

function errorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error ?? fallback
  }

  return fallback
}

export function Dashboard() {
  const { articles, setArticles, loaded } = useArticles()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [view, setView] = useState<View>("form")
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeArticle = articles.find((article) => article.id === activeId)

  const summarizeArticle = async (title: string, content: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data } = await axios.post<{ summary: string }>("/api/article", {
        title,
        content,
      })

      const article: Article = {
        id: crypto.randomUUID(),
        title,
        content,
        summary: data.summary,
      }

      setArticles((current) => [article, ...current])
      setActiveId(article.id)
      setView("summary")
    } catch (caught) {
      setError(errorMessage(caught, "Failed to summarize the article"))
    } finally {
      setLoading(false)
    }
  }

  const takeQuiz = async () => {
    if (!activeArticle) {
      return
    }

    if (activeArticle.quiz) {
      setView("quiz")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data } = await axios.post<{ questions: QuizQuestion[] }>(
        "/api/quiz",
        { title: activeArticle.title, content: activeArticle.content }
      )

      setArticles((current) =>
        current.map((article) =>
          article.id === activeArticle.id
            ? { ...article, quiz: data.questions }
            : article
        )
      )
      setView("quiz")
    } catch (caught) {
      setError(errorMessage(caught, "Failed to generate the quiz"))
    } finally {
      setLoading(false)
    }
  }

  const showForm = () => {
    setActiveId(null)
    setError(null)
    setView("form")
  }

  const selectArticle = (id: string) => {
    setActiveId(id)
    setError(null)
    setView("summary")
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          articles={articles}
          activeId={activeId}
          loaded={loaded}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          onSelect={selectArticle}
        />

        <main className="flex-1 overflow-y-auto bg-muted/30 px-6 py-10">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
            {view === "form" ? (
              <>
                <div hidden={loading}>
                  <ArticleForm
                    loading={loading}
                    error={error}
                    onSubmit={summarizeArticle}
                  />
                </div>
                {loading ? (
                  <GeneratingCard steps={SUMMARY_STEPS} lines={5} />
                ) : null}
              </>
            ) : null}

            {view === "summary" && activeArticle ? (
              <>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="New article"
                  className="self-start"
                  onClick={showForm}
                >
                  <ChevronLeftIcon />
                </Button>
                <ArticleSummary
                  article={activeArticle}
                  loading={loading}
                  error={error}
                  onTakeQuiz={takeQuiz}
                />
                {loading ? (
                  <GeneratingCard steps={QUIZ_STEPS} lines={3} />
                ) : null}
              </>
            ) : null}

            {view === "quiz" && activeArticle?.quiz ? (
              <Quiz
                questions={activeArticle.quiz}
                onExit={() => setView("summary")}
              />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}

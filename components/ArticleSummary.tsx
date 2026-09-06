"use client"

import { useState } from "react"
import { BookOpenIcon, FileTextIcon, SparklesIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogTitle } from "@/components/ui/dialog"
import type { Article } from "@/lib/types"

type ArticleSummaryProps = {
  article: Article
  loading: boolean
  error: string | null
  onTakeQuiz: () => void
}

export function ArticleSummary({
  article,
  loading,
  error,
  onTakeQuiz,
}: ArticleSummaryProps) {
  const [showContent, setShowContent] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-5" />
            <h1 className="font-heading text-lg font-medium">
              Article Quiz Generator
            </h1>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-2 text-sm font-medium">
              <BookOpenIcon className="size-4" />
              Summarized content
            </span>
            <h2 className="font-heading text-base font-medium">
              {article.title}
            </h2>
            <p className="text-sm">{article.summary}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-2 text-sm font-medium">
              <FileTextIcon className="size-4" />
              Article Content
            </span>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {article.content}
            </p>
            <button
              type="button"
              className="self-end text-sm underline-offset-4 hover:underline"
              onClick={() => setShowContent(true)}
            >
              See more
            </button>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button
            className="self-start"
            disabled={loading}
            onClick={onTakeQuiz}
          >
            Take a quiz
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={showContent}
        onClose={() => setShowContent(false)}
        className="max-w-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <DialogTitle>{article.title}</DialogTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={() => setShowContent(false)}
          >
            <XIcon />
          </Button>
        </div>
        <p className="text-sm whitespace-pre-wrap">{article.content}</p>
      </Dialog>
    </>
  )
}

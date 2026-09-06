"use client"

import { useState } from "react"
import { FileTextIcon, Loader2Icon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type ArticleFormProps = {
  loading: boolean
  error: string | null
  onSubmit: (title: string, content: string) => void
}

export function ArticleForm({ loading, error, onSubmit }: ArticleFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const disabled = loading || !title.trim() || !content.trim()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-5" />
          <h1 className="font-heading text-lg font-medium">
            Article Quiz Generator
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Paste your article below to generate a summary and quiz questions.
          Your articles are saved in the sidebar for future reference.
        </p>
      </CardHeader>

      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!disabled) {
              onSubmit(title.trim(), content.trim())
            }
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">
              <FileTextIcon className="size-4" />
              Article Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter a title for your article..."
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="content">
              <FileTextIcon className="size-4" />
              Article Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Paste your article content here..."
              className="min-h-40"
              required
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="self-end" disabled={disabled}>
            {loading ? <Loader2Icon className="animate-spin" /> : null}
            Generate summary
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

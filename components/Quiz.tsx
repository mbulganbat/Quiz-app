"use client"

import { useState } from "react"
import { SparklesIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { QuizResult } from "@/components/QuizResult"
import type { QuizQuestion } from "@/lib/types"

type QuizProps = {
  questions: QuizQuestion[]
  onExit: () => void
}

export function Quiz({ questions, onExit }: QuizProps) {
  const [answers, setAnswers] = useState<string[]>([])
  const [confirmCancel, setConfirmCancel] = useState(false)

  const finished = answers.length === questions.length
  const current = questions[answers.length]

  const restart = () => setAnswers([])

  if (finished) {
    return (
      <QuizResult
        questions={questions}
        answers={answers}
        onRestart={restart}
        onLeave={onExit}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-5" />
            <h1 className="font-heading text-lg font-medium">Quick test</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Take a quick test about your knowledge from your content
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Cancel quiz"
          onClick={() => setConfirmCancel(true)}
        >
          <XIcon />
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <Progress value={(answers.length / questions.length) * 100} />

          <div className="flex items-start justify-between gap-4">
            <h2 className="font-heading text-base font-medium">
              {current.question}
            </h2>
            <p className="shrink-0 font-medium">
              {answers.length + 1}{" "}
              <span className="text-muted-foreground">
                / {questions.length}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {current.options.map((option) => (
              <Button
                key={option}
                variant="outline"
                className="h-10 w-full whitespace-normal"
                onClick={() => setAnswers([...answers, option])}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription className="text-destructive">
          If you press &apos;Cancel&apos;, this quiz will restart from the
          beginning.
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => setConfirmCancel(false)}>Go back</Button>
          <Button
            variant="outline"
            onClick={() => {
              setConfirmCancel(false)
              restart()
              onExit()
            }}
          >
            Cancel quiz
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

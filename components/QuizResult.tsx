"use client"

import {
  BookmarkIcon,
  CircleCheckIcon,
  CircleXIcon,
  RotateCcwIcon,
  SparklesIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { QuizQuestion } from "@/lib/types"

type QuizResultProps = {
  questions: QuizQuestion[]
  answers: string[]
  onRestart: () => void
  onLeave: () => void
}

export function QuizResult({
  questions,
  answers,
  onRestart,
  onLeave,
}: QuizResultProps) {
  const score = questions.filter(
    (question, index) => question.correctAnswer === answers[index]
  ).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-5" />
          <h1 className="font-heading text-lg font-medium">Quiz completed</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Let&apos;s see what you did
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="font-heading text-lg font-medium">
              Your score: {score}{" "}
              <span className="text-muted-foreground">
                / {questions.length}
              </span>
            </p>
            <Progress value={(score / questions.length) * 100} />
          </div>

          <ul className="flex flex-col gap-4">
            {questions.map((question, index) => {
              const answer = answers[index]
              const correct = answer === question.correctAnswer

              return (
                <li key={index} className="flex gap-3">
                  {correct ? (
                    <CircleCheckIcon className="mt-0.5 size-4 shrink-0 text-green-600" />
                  ) : (
                    <CircleXIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                  )}
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm text-muted-foreground">
                      {index + 1}. {question.question}
                    </p>
                    <p className="text-sm">Your answer: {answer ?? "—"}</p>
                    {correct ? null : (
                      <p className="text-sm text-green-600">
                        Correct: {question.correctAnswer}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onRestart}>
              <RotateCcwIcon />
              Restart quiz
            </Button>
            <Button onClick={onLeave}>
              <BookmarkIcon />
              Save and leave
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Loader2Icon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/** How long each status line stays up before the next one takes over. */
const STEP_SECONDS = 6

/** Widths for the placeholder lines, so the block reads like a paragraph. */
const LINE_WIDTHS = ["w-full", "w-full", "w-11/12", "w-4/5", "w-2/3"]

type GeneratingCardProps = {
  /**
   * Status lines in order. The last one is where the card settles, so write it
   * for a wait that has already run long.
   */
  steps: string[]
  lines: number
}

/**
 * Placeholder shown while Gemini is working. Requests take anywhere from a few
 * seconds to about a minute, so a bare spinner leaves people guessing: this
 * counts up and walks through what is happening instead.
 *
 * The elapsed counter starts at mount, which means the parent should render
 * this only while a request is in flight.
 */
export function GeneratingCard({ steps, lines }: GeneratingCardProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => value + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const step = Math.min(
    Math.floor(seconds / STEP_SECONDS),
    Math.max(steps.length - 1, 0)
  )

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span
            aria-live="polite"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Loader2Icon className="size-4 shrink-0 animate-spin" />
            {steps[step]}
          </span>
          <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {seconds}s
          </span>
        </div>

        <div aria-hidden className="flex flex-col gap-2">
          {Array.from({ length: lines }, (_, index) => (
            <Skeleton
              key={index}
              className={LINE_WIDTHS[index % LINE_WIDTHS.length]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

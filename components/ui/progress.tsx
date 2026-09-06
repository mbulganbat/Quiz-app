import * as React from "react"

import { cn } from "@/lib/utils"

function Progress({
  value,
  className,
  ...props
}: React.ComponentProps<"div"> & { value: number }) {
  const clamped = Math.min(Math.max(value, 0), 100)

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export { Progress }

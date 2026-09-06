import * as React from "react"

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("h-4 animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

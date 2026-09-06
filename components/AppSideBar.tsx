"use client"

import { PanelLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Article } from "@/lib/types"

type AppSidebarProps = {
  articles: Article[]
  activeId: string | null
  loaded: boolean
  collapsed: boolean
  onToggle: () => void
  onSelect: (id: string) => void
}

export function AppSidebar({
  articles,
  activeId,
  loaded,
  collapsed,
  onToggle,
  onSelect,
}: AppSidebarProps) {
  if (collapsed) {
    return (
      <div className="flex w-14 shrink-0 flex-col items-center border-r border-border py-4">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Expand sidebar"
          onClick={onToggle}
        >
          <PanelLeftIcon />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-60 shrink-0 flex-col border-r border-border py-4">
      <div className="flex items-center justify-between px-4">
        <span className="text-sm font-medium">History</span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Collapse sidebar"
          onClick={onToggle}
        >
          <PanelLeftIcon />
        </Button>
      </div>

      <nav className="mt-3 flex flex-col gap-0.5 overflow-y-auto px-2">
        {!loaded ? null : articles.length === 0 ? (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">
            No saved articles yet.
          </p>
        ) : (
          articles.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => onSelect(article.id)}
              className={cn(
                "rounded-xl px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
                article.id === activeId && "bg-muted font-medium"
              )}
            >
              {article.title}
            </button>
          ))
        )}
      </nav>
    </div>
  )
}

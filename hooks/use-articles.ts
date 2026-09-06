"use client"

import { useSyncExternalStore } from "react"
import type { Dispatch, SetStateAction } from "react"

import type { Article } from "@/lib/types"

const STORAGE_KEY = "quiz-app.articles"

/** Stable reference, so the server snapshot never looks like a new value. */
const EMPTY: Article[] = []

const listeners = new Set<() => void>()

/** `null` until localStorage has been read for the first time. */
let snapshot: Article[] | null = null

function readStorage(): Article[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return EMPTY
    }

    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return EMPTY
    }

    return parsed.filter((item): item is Article => {
      const article = item as Partial<Article> | null

      return (
        typeof article?.id === "string" &&
        typeof article.title === "string" &&
        typeof article.content === "string" &&
        typeof article.summary === "string"
      )
    })
  } catch {
    return EMPTY
  }
}

function emit() {
  for (const listener of listeners) {
    listener()
  }
}

function onStorageEvent(event: StorageEvent) {
  // `key` is null when the whole store is cleared.
  if (event.key !== null && event.key !== STORAGE_KEY) {
    return
  }

  snapshot = readStorage()
  emit()
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("storage", onStorageEvent)
  }

  listeners.add(listener)

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorageEvent)
    }
  }
}

function getSnapshot(): Article[] {
  snapshot ??= readStorage()

  return snapshot
}

function getServerSnapshot(): Article[] {
  return EMPTY
}

const setArticles: Dispatch<SetStateAction<Article[]>> = (update) => {
  const next = typeof update === "function" ? update(getSnapshot()) : update

  snapshot = next

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage can be disabled or full; the list still works for this session.
  }

  emit()
}

/**
 * Article history backed by localStorage, so the sidebar survives a reload and
 * stays in step across tabs. React renders the empty server snapshot while
 * hydrating and swaps in the stored list right after, which keeps the server
 * and client markup identical.
 *
 * `loaded` is false during that first hydrating render, so callers can hold
 * back an empty state that would otherwise flash before the list arrives.
 */
export function useArticles() {
  const articles = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const loaded = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

  return { articles, setArticles, loaded }
}

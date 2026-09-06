import Link from "next/link"

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
      <Link href="/" className="font-heading text-base font-medium">
        Quiz app
      </Link>
      <div
        aria-hidden
        className="size-8 rounded-full bg-linear-to-br from-fuchsia-400 via-violet-400 to-sky-400"
      />
    </header>
  )
}

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
      <Link href="/" className="font-heading text-base font-medium">
        Quiz app
      </Link>
      <UserButton />
    </header>
  )
}

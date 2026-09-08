import { clerkMiddleware } from "@clerk/nextjs/server"

/**
 * Clerk only reads the session here. Authorization lives next to the data it
 * guards — see `app/page.tsx` and the route handlers under `app/api` — because
 * path matching in the proxy can drift from how Next.js actually routes.
 */
export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
}

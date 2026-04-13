import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public routes - no auth needed
  const publicRoutes = ["/", "/quiz", "/pricing", "/result", "/login", "/check-email", "/api/auth", "/api/stripe/webhook"]
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route)) || pathname.startsWith("/api/auth")

  if (isPublic) return NextResponse.next()

  // Protected app routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|sounds|manifest.json|sw.js).*)"],
}

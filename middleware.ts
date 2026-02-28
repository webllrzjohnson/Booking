import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    )
  }

  if (pathname.startsWith("/dashboard/admin")) {
    const userRole = req.auth?.user?.role
    if (userRole !== "ADMIN") {
      if (userRole === "STAFF") {
        return NextResponse.redirect(new URL("/dashboard/staff", req.url))
      }
      return NextResponse.redirect(new URL("/dashboard/bookings", req.url))
    }
  }

  if (pathname.startsWith("/dashboard/staff")) {
    const userRole = req.auth?.user?.role
    if (userRole !== "STAFF" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/bookings", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*"],
  runtime: "nodejs",
}

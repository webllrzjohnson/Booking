"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/auth/logout-button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  user?: {
    name?: string | null
    role: string
  } | null
  siteName?: string
  logoUrl?: string | null
}

export function Header({
  user,
  siteName = "Fitness Health",
  logoUrl,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const guestNavLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/bookings/lookup", label: "Find My Booking" },
  ]

  const loggedInNavLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
  ]

  const navLinks = user ? loggedInNavLinks : guestNavLinks

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={siteName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
              {siteName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="text-xl font-semibold text-gray-900">{siteName}</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-gray-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {user.role === "CUSTOMER" && (
                <Link href="/dashboard/bookings">
                  <Button variant="ghost" size="sm">
                    My Bookings
                  </Button>
                </Link>
              )}
              {(user.role === "STAFF" || user.role === "ADMIN") && (
                <Link href="/dashboard/staff">
                  <Button variant="ghost" size="sm">
                    Staff Dashboard
                  </Button>
                </Link>
              )}
              <span className="text-sm text-gray-600">{user.name || "User"}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container flex flex-col space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href ? "text-primary" : "text-gray-600"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === "CUSTOMER" && (
                  <Link
                    href="/dashboard/bookings"
                    className="text-sm font-medium text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}
                {(user.role === "STAFF" || user.role === "ADMIN") && (
                  <Link
                    href="/dashboard/staff"
                    className="text-sm font-medium text-gray-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Staff Dashboard
                  </Link>
                )}
                <span className="text-sm text-gray-500">{user.name || "User"}</span>
                <LogoutButton variant="outline" size="sm" className="w-full mt-2" />
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

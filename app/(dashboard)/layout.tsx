import { redirect } from "next/navigation"
import Link from "next/link"
import { Calendar, User, Settings } from "lucide-react"

import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/bookings")
  }

  const isStaff = session.user.role === "STAFF" || session.user.role === "ADMIN"

  const navItems = [
    {
      href: "/dashboard/bookings",
      label: "My Bookings",
      icon: Calendar,
      roles: ["CUSTOMER", "STAFF", "ADMIN"],
    },
    {
      href: "/dashboard/staff",
      label: "Staff Dashboard",
      icon: User,
      roles: ["STAFF", "ADMIN"],
    },
    {
      href: "/dashboard/staff/availability",
      label: "Manage Availability",
      icon: Settings,
      roles: ["STAFF", "ADMIN"],
    },
  ]

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(session.user.role)
  )

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="sticky top-20 space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {session.user.name}
              </h2>
              <p className="text-sm text-gray-600">{session.user.email}</p>
            </div>

            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  )
}

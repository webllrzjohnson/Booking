import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

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
      icon: "Calendar",
      roles: ["CUSTOMER", "STAFF", "ADMIN"],
    },
    {
      href: "/dashboard/staff",
      label: "Staff Dashboard",
      icon: "User",
      roles: ["STAFF", "ADMIN"],
    },
    {
      href: "/dashboard/staff/availability",
      label: "Manage Availability",
      icon: "Settings",
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
          <DashboardSidebar
            user={{
              name: session.user.name,
              email: session.user.email,
              role: session.user.role,
            }}
            navItems={filteredNavItems}
          />
        </aside>

        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  )
}

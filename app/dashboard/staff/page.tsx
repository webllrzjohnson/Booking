import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getStaffByUserId } from "@/lib/queries/staff"
import { getStaffUpcomingBookingsPaginated } from "@/lib/queries/booking"
import { StaffBookingsList } from "@/components/staff/staff-bookings-list"

const DEFAULT_PAGE_SIZE = 10

export const metadata: Metadata = {
  title: "Staff Dashboard - Fitness Health",
  description: "View your appointments and manage your schedule.",
}

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function StaffDashboardPage({ searchParams }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  if (session.user.role !== "STAFF" && session.user.role !== "ADMIN") {
    redirect("/dashboard/bookings")
  }

  const staff = await getStaffByUserId(session.user.id)

  if (!staff) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Staff Profile Not Found
        </h1>
        <p className="text-gray-600">
          Your account is not linked to a staff profile.
        </p>
      </div>
    )
  }

  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)

  const { bookings, total } = await getStaffUpcomingBookingsPaginated(
    staff.id,
    page,
    DEFAULT_PAGE_SIZE
  )

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Staff Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {session.user.name}
        </p>
      </div>

      <StaffBookingsList
        bookings={bookings}
        page={page}
        pageSize={DEFAULT_PAGE_SIZE}
        total={total}
        totalPages={totalPages}
      />
    </div>
  )
}

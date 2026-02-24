import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { startOfDay, endOfDay } from "date-fns"

import { auth } from "@/lib/auth"
import { getStaffByUserId } from "@/lib/queries/staff"
import { getStaffBookings } from "@/lib/queries/booking"
import { StaffBookingsList } from "@/components/staff/staff-bookings-list"

export const metadata: Metadata = {
  title: "Staff Dashboard - Fitness Health",
  description: "View your appointments and manage your schedule.",
}

export default async function StaffDashboardPage() {
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

  const today = new Date()
  const bookings = await getStaffBookings(
    staff.id,
    startOfDay(today),
    endOfDay(today)
  )

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

      <StaffBookingsList bookings={bookings} />
    </div>
  )
}

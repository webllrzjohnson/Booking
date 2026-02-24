import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getStaffByUserId } from "@/lib/queries/staff"
import { AvailabilityManager } from "@/components/staff/availability-manager"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Manage Availability - Staff Dashboard - Fitness Health",
  description: "Set your working hours and availability.",
}

export default async function ManageAvailabilityPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  if (session.user.role !== "STAFF" && session.user.role !== "ADMIN") {
    redirect("/dashboard/bookings")
  }

  const staff = await getStaffByUserId(session.user.id)

  if (!staff) {
    redirect("/dashboard/bookings")
  }

  const workingHours = await db.workingHours.findMany({
    where: {
      staffId: staff.id,
    },
    orderBy: {
      dayOfWeek: "asc",
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manage Availability
        </h1>
        <p className="text-gray-600">
          Set your working hours for each day of the week
        </p>
      </div>

      <AvailabilityManager staffId={staff.id} workingHours={workingHours} />
    </div>
  )
}

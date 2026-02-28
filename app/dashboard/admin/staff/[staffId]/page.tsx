import Link from "next/link"
import { redirect, notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getStaffWithDetails } from "@/lib/queries/staff"
import { getServices } from "@/lib/queries/service"
import { auth } from "@/lib/auth"
import { StaffFormEdit } from "@/components/admin/staff-form"
import { AvailabilityManager } from "@/components/staff/availability-manager"
import { StaffEditFormWrapper } from "./staff-edit-form-wrapper"

export const metadata = {
  title: "Edit Staff - Admin - Fitness Health",
  description: "Edit staff profile and availability.",
}

type PageProps = {
  params: Promise<{ staffId: string }>
}

export default async function AdminStaffEditPage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard/bookings")
  }

  const { staffId } = await params
  const [staff, services] = await Promise.all([
    getStaffWithDetails(staffId),
    getServices(),
  ])

  if (!staff) {
    notFound()
  }

  const serviceOptions = services.map((s) => ({ id: s.id, name: s.name }))
  const workingHours = staff.workingHours.map((wh) => ({
    id: wh.id,
    dayOfWeek: wh.dayOfWeek,
    startTime: wh.startTime,
    endTime: wh.endTime,
    isAvailable: wh.isAvailable,
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/admin/staff"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Staff
          </Link>
          <h1 className="mt-1 text-2xl font-bold">Edit {staff.name}</h1>
          <p className="text-gray-600">{staff.email}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Profile</h2>
          <StaffEditFormWrapper
            staffId={staffId}
            defaultValues={{
              bio: staff.bio,
              imageUrl: staff.imageUrl,
              serviceIds: staff.serviceIds,
            }}
            services={serviceOptions}
          />
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Availability</h2>
          <AvailabilityManager staffId={staffId} workingHours={workingHours} />
        </div>
      </div>
    </div>
  )
}

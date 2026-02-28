import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getAllStaff } from "@/lib/queries/staff"
import { StaffList } from "@/components/admin/staff-list"

export const metadata = {
  title: "Manage Staff - Admin - Fitness Health",
  description: "Add and edit staff members.",
}

export default async function AdminStaffPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard/bookings")
  }

  const staff = await getAllStaff()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Manage Staff</h1>
        <p className="text-gray-600">
          Add new staff members or edit existing profiles.
        </p>
      </div>

      <StaffList staff={staff} />
    </div>
  )
}

import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllServices } from "@/lib/queries/service"
import { getAllStaff } from "@/lib/queries/staff"

export const metadata = {
  title: "Admin Panel - Fitness Health",
  description: "Manage services and staff.",
}

export default async function AdminPage() {
  const [services, staff] = await Promise.all([
    getAllServices(),
    getAllStaff(),
  ])

  const activeServiceCount = services.filter((s) => s.isActive).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-600">
          Manage services and staff for your clinic.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/admin/settings">
          <Card className="transition-colors hover:bg-gray-50 cursor-pointer">
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Colors, logo, hero image, contact info
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/admin/services">
          <Card className="transition-colors hover:bg-gray-50 cursor-pointer">
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{activeServiceCount}</p>
              <p className="text-sm text-gray-500">
                {services.length} total
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/admin/staff">
          <Card className="transition-colors hover:bg-gray-50 cursor-pointer">
            <CardHeader>
              <CardTitle>Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{staff.length}</p>
              <p className="text-sm text-gray-500">
                practitioners
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

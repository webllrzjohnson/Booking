import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getAllServices } from "@/lib/queries/service"
import { ServiceList } from "@/components/admin/service-list"

export const metadata = {
  title: "Manage Services - Admin - Fitness Health",
  description: "Add, edit, and deactivate services.",
}

export default async function AdminServicesPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard/bookings")
  }

  const services = await getAllServices()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <p className="text-gray-600">
          Add, edit, or deactivate services offered by your clinic.
        </p>
      </div>

      <ServiceList services={services} />
    </div>
  )
}

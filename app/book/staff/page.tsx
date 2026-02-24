import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getServiceById } from "@/lib/queries/service"
import { getStaffByService } from "@/lib/queries/staff"
import { StaffSelector } from "@/components/booking/staff-selector"

export const metadata: Metadata = {
  title: "Book Appointment - Step 2: Choose Staff - Fitness Health",
  description: "Select your preferred practitioner for your appointment.",
}

interface StaffPageProps {
  searchParams: Promise<{ service?: string }>
}

export default async function BookStaffPage({ searchParams }: StaffPageProps) {
  const { service: serviceId } = await searchParams

  if (!serviceId) {
    redirect("/book")
  }

  const [service, staff] = await Promise.all([
    getServiceById(serviceId),
    getStaffByService(serviceId),
  ])

  if (!service) {
    redirect("/book")
  }

  if (staff.length === 0) {
    return (
      <div className="py-12 md:py-20">
        <div className="container max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Available Staff
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, there are currently no practitioners available for{" "}
            {service.name}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Choose Your Practitioner
          </h1>
          <p className="text-lg text-gray-600">
            Step 2 of 4: {service.name}
          </p>
        </div>

        <StaffSelector staff={staff} serviceId={serviceId} />
      </div>
    </div>
  )
}

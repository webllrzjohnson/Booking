import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getServiceById } from "@/lib/queries/service"
import { getStaffById } from "@/lib/queries/staff"
import { CustomerDetailsForm } from "@/components/booking/customer-details-form"

export const metadata: Metadata = {
  title: "Book Appointment - Step 4: Your Details - Fitness Health",
  description: "Enter your contact details to confirm your appointment.",
}

interface DetailsPageProps {
  searchParams: Promise<{ service?: string; staff?: string; start?: string }>
}

export default async function BookDetailsPage({
  searchParams,
}: DetailsPageProps) {
  const { service: serviceId, staff: staffId, start: startTime } = await searchParams

  if (!serviceId || !staffId || !startTime) {
    redirect("/book")
  }

  const session = await auth()

  const [service, staff] = await Promise.all([
    getServiceById(serviceId),
    getStaffById(staffId),
  ])

  if (!service || !staff) {
    redirect("/book")
  }

  const startDate = new Date(startTime)
  if (isNaN(startDate.getTime())) {
    redirect("/book")
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Confirm Your Details
          </h1>
          <p className="text-lg text-gray-600">
            Step 4 of 4: Enter your contact information
          </p>
        </div>

        <CustomerDetailsForm
          service={service}
          staff={staff}
          startTime={startDate}
          user={session?.user}
        />
      </div>
    </div>
  )
}

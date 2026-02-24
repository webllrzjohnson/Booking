import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getServiceById } from "@/lib/queries/service"
import { getStaffById } from "@/lib/queries/staff"
import { DateTimeSelector } from "@/components/booking/date-time-selector"

export const metadata: Metadata = {
  title: "Book Appointment - Step 3: Choose Date & Time - Fitness Health",
  description: "Select your preferred date and time for your appointment.",
}

interface DateTimePageProps {
  searchParams: { service?: string; staff?: string }
}

export default async function BookDateTimePage({
  searchParams,
}: DateTimePageProps) {
  const { service: serviceId, staff: staffId } = searchParams

  if (!serviceId || !staffId) {
    redirect("/book")
  }

  const [service, staff] = await Promise.all([
    getServiceById(serviceId),
    getStaffById(staffId),
  ])

  if (!service || !staff) {
    redirect("/book")
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Choose Date & Time
          </h1>
          <p className="text-lg text-gray-600">
            Step 3 of 4: {service.name} with {staff.name}
          </p>
        </div>

        <DateTimeSelector
          serviceId={service.id}
          staffId={staff.id}
          serviceName={service.name}
          staffName={staff.name}
          durationMinutes={service.durationMinutes}
        />
      </div>
    </div>
  )
}

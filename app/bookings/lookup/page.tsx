import type { Metadata } from "next"

import { GuestBookingLookup } from "@/components/bookings/guest-booking-lookup"

export const metadata: Metadata = {
  title: "Find My Booking - Fitness Health",
  description: "Look up your booking using your email and reference number.",
}

export default function BookingLookupPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Find My Booking
          </h1>
          <p className="text-gray-600">
            Enter your email and booking reference to view your appointment
          </p>
        </div>

        <GuestBookingLookup />
      </div>
    </div>
  )
}

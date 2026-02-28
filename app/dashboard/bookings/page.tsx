import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { auth } from "@/lib/auth"
import { getUserBookings } from "@/lib/queries/booking"
import { BookingsList } from "@/components/bookings/bookings-list"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "My Bookings - Fitness Health",
  description: "View and manage your appointments at Fitness Health.",
}

export default async function MyBookingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/bookings")
  }

  if (session.user.role === "STAFF" || session.user.role === "ADMIN") {
    redirect("/dashboard/staff")
  }

  const bookings = await getUserBookings(session.user.id)

  const now = new Date()
  const upcoming = bookings.filter((b) => b.startTime >= now && b.status !== "CANCELLED")
  const past = bookings.filter((b) => b.startTime < now || b.status === "CANCELLED")

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">
          View, reschedule, or cancel your appointments
        </p>
      </div>

      <BookingsList upcoming={upcoming} past={past} />

      <div className="mt-8 text-center">
        <Link href="/book">
          <Button size="lg" className="bg-teal-500 hover:bg-teal-600">
            Book Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

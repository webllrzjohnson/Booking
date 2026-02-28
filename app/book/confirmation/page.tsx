import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { CheckCircle, Calendar, Clock, User, DollarSign } from "lucide-react"

const BUSINESS_TIMEZONE = "America/Toronto"

import { auth } from "@/lib/auth"
import { getBookingById } from "@/lib/queries/booking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AddToCalendarButton } from "@/components/booking/add-to-calendar-button"

export const metadata: Metadata = {
  title: "Booking Confirmed - Fitness Health",
  description: "Your appointment has been confirmed.",
}

interface ConfirmationPageProps {
  searchParams: Promise<{ booking?: string }>
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const { booking: bookingId } = await searchParams

  if (!bookingId) {
    redirect("/book")
  }

  const booking = await getBookingById(bookingId)

  if (!booking) {
    redirect("/book")
  }

  const session = await auth()

  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-teal-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your appointment has been successfully booked
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Appointment Details</span>
              <span className="text-sm font-normal text-gray-600">
                Ref: {booking.id.slice(-8).toUpperCase()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 flex justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">
                    {format(toZonedTime(booking.startTime, BUSINESS_TIMEZONE), "EEEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(toZonedTime(booking.startTime, BUSINESS_TIMEZONE), "h:mm a")} -{" "}
                    {format(toZonedTime(booking.endTime, BUSINESS_TIMEZONE), "h:mm a")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <div className="w-5 flex justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-medium">{booking.service.name}</p>
                  <p className="text-sm text-gray-600">
                    with {booking.staff.user.name}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <div className="w-5 flex justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">
                    {booking.service.durationMinutes} minutes
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <div className="w-5 flex justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-medium text-lg">
                    ${booking.service.price.toString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <AddToCalendarButton
                title={`${booking.service.name} at Fitness Health`}
                description={`${booking.service.name} appointment with ${booking.staff.user.name}`}
                location="Fitness Health - 123 Wellness Street, Health City"
                startTime={booking.startTime}
                endTime={booking.endTime}
              />

              {session ? (
                <Link href="/dashboard/bookings" className="block">
                  <Button variant="outline" className="w-full">
                    View My Bookings
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/bookings/lookup" className="block">
                    <Button variant="outline" className="w-full">
                      Find My Booking (use email + ref above)
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button variant="outline" className="w-full">
                      Create Account to Manage Bookings
                    </Button>
                  </Link>
                </>
              )}

              <Link href="/book" className="block">
                <Button variant="ghost" className="w-full">
                  Book Another Appointment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>What to bring:</strong> Please arrive 10 minutes early for
            your first appointment. Bring any relevant medical records or
            prescriptions.
          </p>
        </div>
      </div>
    </div>
  )
}

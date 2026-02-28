"use client"

import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { Calendar, CalendarClock, User, DollarSign } from "lucide-react"

import type { GuestBookingLookupResult } from "@/lib/actions/guest-booking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const BUSINESS_TIMEZONE = "America/Toronto"

type BookingItem = GuestBookingLookupResult["matchingBooking"]

function BookingCard({
  booking,
  showManagePrompt = false,
}: {
  booking: BookingItem
  showManagePrompt?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>Your Appointment</CardTitle>
          <Badge
            variant={
              booking.status === "CANCELLED" ? "destructive" : "default"
            }
          >
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" aria-hidden />
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-medium">
                {format(
                  toZonedTime(new Date(booking.startTime), BUSINESS_TIMEZONE),
                  "EEEE, MMMM d, yyyy"
                )}
              </p>
              <p className="text-sm text-gray-600">
                {format(
                  toZonedTime(new Date(booking.startTime), BUSINESS_TIMEZONE),
                  "h:mm a"
                )}{" "}
                -{" "}
                {format(
                  toZonedTime(new Date(booking.endTime), BUSINESS_TIMEZONE),
                  "h:mm a"
                )}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" aria-hidden />
            <div>
              <p className="text-sm text-gray-600">Service & Practitioner</p>
              <p className="font-medium">{booking.service.name}</p>
              <p className="text-sm text-gray-600">
                with {booking.staff.user.name}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" aria-hidden />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-medium text-lg">
                ${booking.service.price.toString()}
              </p>
            </div>
          </div>
        </div>

        {booking.status !== "CANCELLED" && showManagePrompt && (
          <div className="pt-4 space-y-2">
            <p className="text-sm text-gray-600">
              To manage this booking, please{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                create an account
              </a>{" "}
              or{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                log in
              </a>
              .
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function BookingLookupResults({ result }: { result: GuestBookingLookupResult }) {
  return (
    <div className="space-y-6">
      <BookingCard booking={result.matchingBooking} showManagePrompt />

      {result.otherUpcomingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" aria-hidden />
              Your Other Upcoming Appointments
            </CardTitle>
            <p className="text-sm text-gray-600 font-normal">
              You have {result.otherUpcomingBookings.length} other appointment
              {result.otherUpcomingBookings.length > 1 ? "s" : ""} scheduled
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {result.otherUpcomingBookings.map((booking) => (
                <li key={booking.id}>
                  <div className="flex flex-col gap-1 rounded-lg border p-4">
                    <p className="font-medium">{booking.service.name}</p>
                    <p className="text-sm text-gray-600">
                      {format(
                        toZonedTime(
                          new Date(booking.startTime),
                          BUSINESS_TIMEZONE
                        ),
                        "EEEE, MMM d · h:mm a"
                      )}{" "}
                      · with {booking.staff.user.name}
                    </p>
                    <p className="text-sm font-medium">
                      ${booking.service.price.toString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

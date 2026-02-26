"use client"

import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { Calendar, Clock, User, Mail, Phone } from "lucide-react"

const BUSINESS_TIMEZONE = "America/Toronto"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface StaffBooking {
  id: string
  startTime: Date
  endTime: Date
  status: string
  notes: string | null
  guestName: string | null
  guestEmail: string | null
  guestPhone: string | null
  user: {
    name: string
    email: string | null
    phone: string | null
  } | null
  service: {
    name: string
  }
}

interface StaffBookingsListProps {
  bookings: StaffBooking[]
}

export function StaffBookingsList({ bookings }: StaffBookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
        <p className="text-gray-600">No appointments scheduled for today</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Today&apos;s Appointments ({bookings.length})
      </h2>

      {bookings.map((booking) => {
        const customerName = booking.user?.name || booking.guestName
        const customerEmail = booking.user?.email || booking.guestEmail
        const customerPhone = booking.user?.phone || booking.guestPhone

        return (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{booking.service.name}</CardTitle>
                <Badge variant="default">{booking.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">
                    {format(toZonedTime(booking.startTime, BUSINESS_TIMEZONE), "h:mm a")} -{" "}
                    {format(toZonedTime(booking.endTime, BUSINESS_TIMEZONE), "h:mm a")}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-gray-600" />
                    <span>{customerName}</span>
                  </div>

                  {customerEmail && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <a
                        href={`mailto:${customerEmail}`}
                        className="text-blue-600 hover:underline"
                      >
                        {customerEmail}
                      </a>
                    </div>
                  )}

                  {customerPhone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <a
                        href={`tel:${customerPhone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {customerPhone}
                      </a>
                    </div>
                  )}
                </div>

                {booking.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Patient Notes</p>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

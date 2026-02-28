"use client"

import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock, Mail, Phone, User } from "lucide-react"

const BUSINESS_TIMEZONE = "America/Toronto"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type StaffBooking = {
  id: string
  startTime: Date | string
  endTime: Date | string
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

type StaffBookingsListProps = {
  bookings: StaffBooking[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export function StaffBookingsList({
  bookings,
  page,
  pageSize,
  total,
  totalPages,
}: StaffBookingsListProps) {
  const startRow = total === 0 ? 0 : (page - 1) * pageSize + 1
  const endRow = Math.min(page * pageSize, total)

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
        <p className="text-gray-600">No upcoming appointments scheduled</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Upcoming Appointments ({total})
        </h2>
        <p className="text-sm text-gray-600">
          Showing {startRow}–{endRow} of {total}
        </p>
      </div>

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
                    {format(
                      toZonedTime(new Date(booking.startTime), BUSINESS_TIMEZONE),
                      "EEE, MMM d"
                    )}{" "}
                    {format(
                      toZonedTime(new Date(booking.startTime), BUSINESS_TIMEZONE),
                      "h:mm a"
                    )}{" "}
                    –{" "}
                    {format(
                      toZonedTime(new Date(booking.endTime), BUSINESS_TIMEZONE),
                      "h:mm a"
                    )}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          {page > 1 ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`?page=${page - 1}`} aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`?page=${page + 1}`} aria-label="Next page">
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

"use client"

import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { Calendar, Clock, User as UserIcon } from "lucide-react"

const BUSINESS_TIMEZONE = "America/Toronto"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RescheduleDialog } from "@/components/bookings/reschedule-dialog"
import { CancelDialog } from "@/components/bookings/cancel-dialog"

interface Booking {
  id: string
  serviceId: string
  staffId: string
  startTime: Date
  endTime: Date
  status: string
  notes: string | null
  service: {
    name: string
    price: any
  }
  staff: {
    id: string
    user: {
      name: string
    }
  }
}

interface BookingCardProps {
  booking: Booking
  showActions?: boolean
}

export function BookingCard({ booking, showActions = false }: BookingCardProps) {
  const statusVariant = {
    CONFIRMED: "default" as const,
    PENDING: "secondary" as const,
    COMPLETED: "secondary" as const,
    CANCELLED: "destructive" as const,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{booking.service.name}</CardTitle>
          <Badge variant={statusVariant[booking.status as keyof typeof statusVariant]}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="font-medium">
              {format(toZonedTime(new Date(booking.startTime), BUSINESS_TIMEZONE), "EEEE, MMMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-gray-600" />
            <span>
              {format(toZonedTime(new Date(booking.startTime), BUSINESS_TIMEZONE), "h:mm a")} -{" "}
              {format(toZonedTime(new Date(booking.endTime), BUSINESS_TIMEZONE), "h:mm a")}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <UserIcon className="h-4 w-4 text-gray-600" />
            <span>{booking.staff.user.name}</span>
          </div>
        </div>

        {booking.notes && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Notes</p>
              <p className="text-sm">{booking.notes}</p>
            </div>
          </>
        )}

        {showActions && booking.status !== "CANCELLED" && (
          <>
            <Separator />
            <div className="flex gap-2">
              <RescheduleDialog booking={booking} />
              <CancelDialog bookingId={booking.id} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

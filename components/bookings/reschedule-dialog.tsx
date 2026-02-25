"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, addDays } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { rescheduleBookingAction } from "@/lib/actions/update-booking"
import { getAvailableSlotsAction, getAvailableDatesAction } from "@/lib/actions/availability"

interface Booking {
  id: string
  serviceId: string
  staffId: string
  startTime: Date
  endTime: Date
  service: {
    name: string
  }
  staff: {
    id: string
    user: {
      name: string
    }
  }
}

interface RescheduleDialogProps {
  booking: Booking
}

export function RescheduleDialog({ booking }: RescheduleDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availableSlots, setAvailableSlots] = useState<
    Array<{ startTime: string; endTime: string }>
  >([])
  const [selectedSlot, setSelectedSlot] = useState<string>()
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set())
  const [isLoadingDates, setIsLoadingDates] = useState(true)

  useEffect(() => {
    async function loadAvailableDates() {
      if (!open) return

      setIsLoadingDates(true)
      const startDate = new Date()
      const endDate = addDays(new Date(), 60)
      
      const result = await getAvailableDatesAction(
        booking.staffId,
        booking.serviceId,
        startDate,
        endDate
      )
      
      if (result.success) {
        setAvailableDates(new Set(result.data))
      }
      setIsLoadingDates(false)
    }

    loadAvailableDates()
  }, [open, booking.staffId, booking.serviceId])

  async function handleDateSelect(date: Date | undefined) {
    setSelectedDate(date)
    setSelectedSlot(undefined)
    setAvailableSlots([])
    setError(null)

    if (!date) return

    setIsLoadingSlots(true)
    const result = await getAvailableSlotsAction(
      booking.staffId,
      booking.serviceId,
      date
    )
    setIsLoadingSlots(false)

    if (result.success) {
      setAvailableSlots(result.data)
    }
  }

  async function handleReschedule() {
    if (!selectedSlot) return

    setIsSubmitting(true)
    setError(null)

    const result = await rescheduleBookingAction(booking.id, selectedSlot)

    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      setError(result.error)
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Select a new date and time for your {booking.service.name} appointment
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Select New Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const dateStr = format(date, "yyyy-MM-dd")
                const hasNoAvailability = !isLoadingDates && !availableDates.has(dateStr)
                return (
                  date < today || date.getDay() === 0 || date.getDay() === 6 || hasNoAvailability
                )
              }}
              className="rounded-md border"
            />
          </div>

          <div>
            <h3 className="font-medium mb-3">Select New Time</h3>
            {!selectedDate ? (
              <p className="text-sm text-gray-600 py-8">
                Please select a date first
              </p>
            ) : isLoadingSlots ? (
              <p className="text-sm text-gray-600 py-8">Loading times...</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-gray-600 py-8">
                No available times for this date
              </p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.startTime}
                      variant={
                        selectedSlot === slot.startTime ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedSlot(slot.startTime)}
                    >
                      {format(new Date(slot.startTime), "h:mm a")}
                    </Button>
                  ))}
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <Button
                  onClick={handleReschedule}
                  disabled={!selectedSlot || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Rescheduling..." : "Confirm Reschedule"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

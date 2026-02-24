"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAvailableSlotsAction } from "@/lib/actions/availability"

interface DateTimeSelectorProps {
  serviceId: string
  staffId: string
  serviceName: string
  staffName: string
  durationMinutes: number
}

export function DateTimeSelector({
  serviceId,
  staffId,
  serviceName,
  staffName,
  durationMinutes,
}: DateTimeSelectorProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availableSlots, setAvailableSlots] = useState<
    Array<{ startTime: string; endTime: string }>
  >([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string>()

  async function handleDateSelect(date: Date | undefined) {
    setSelectedDate(date)
    setSelectedSlot(undefined)
    setAvailableSlots([])

    if (!date) return

    setIsLoadingSlots(true)
    const result = await getAvailableSlotsAction(staffId, serviceId, date)
    setIsLoadingSlots(false)

    if (result.success) {
      setAvailableSlots(result.data)
    }
  }

  function handleSlotSelect(startTime: string) {
    setSelectedSlot(startTime)
  }

  function handleContinue() {
    if (!selectedSlot) return

    router.push(
      `/book/details?service=${serviceId}&staff=${staffId}&start=${selectedSlot}`
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today || date.getDay() === 0 || date.getDay() === 6
            }}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Times</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-sm text-gray-600 text-center py-8">
                Please select a date to view available times
              </p>
            ) : isLoadingSlots ? (
              <p className="text-sm text-gray-600 text-center py-8">
                Loading available times...
              </p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-gray-600 text-center py-8">
                No available times for this date. Please select another date.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.startTime}
                    variant={
                      selectedSlot === slot.startTime ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleSlotSelect(slot.startTime)}
                  >
                    {format(new Date(slot.startTime), "h:mm a")}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedDate && selectedSlot && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Practitioner:</span>
                <span className="font-medium">{staffName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {format(new Date(selectedSlot), "h:mm a")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{durationMinutes} minutes</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={handleContinue}
          disabled={!selectedSlot}
          className="w-full"
          size="lg"
        >
          Continue to Details
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { updateWorkingHoursAction } from "@/lib/actions/manage-availability"

interface WorkingHour {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface AvailabilityManagerProps {
  staffId: string
  workingHours: WorkingHour[]
}

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function AvailabilityManager({
  staffId,
  workingHours,
}: AvailabilityManagerProps) {
  const router = useRouter()
  const [hours, setHours] = useState(() => {
    const hoursMap: Record<number, WorkingHour> = {}
    workingHours.forEach((wh) => {
      hoursMap[wh.dayOfWeek] = wh
    })
    for (let i = 1; i <= 7; i++) {
      if (!hoursMap[i]) {
        hoursMap[i] = {
          id: "",
          dayOfWeek: i,
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: false,
        }
      }
    }
    return hoursMap
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function updateDay(
    dayOfWeek: number,
    field: keyof WorkingHour,
    value: string | boolean
  ) {
    setHours((prev) => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        [field]: value,
      },
    }))
  }

  async function handleSave() {
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    const updates = Object.values(hours)

    for (const hour of updates) {
      if (hour.isAvailable) {
        const start = hour.startTime.split(":")
        const end = hour.endTime.split(":")
        const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1])
        const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1])

        if (endMinutes <= startMinutes) {
          setError("End time must be after start time")
          setIsSaving(false)
          return
        }
      }
    }

    const result = await updateWorkingHoursAction(staffId, updates)

    if (result.success) {
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error)
    }

    setIsSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-teal-50 border border-teal-200 p-3 text-sm text-teal-700">
            Availability updated successfully!
          </div>
        )}

        <div className="space-y-4">
          {dayNames.map((dayName, index) => {
            const dayOfWeek = index + 1
            const dayHours = hours[dayOfWeek]

            return (
              <div
                key={dayOfWeek}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-2 md:w-48">
                  <Checkbox
                    checked={dayHours.isAvailable}
                    onCheckedChange={(checked) =>
                      updateDay(dayOfWeek, "isAvailable", checked === true)
                    }
                  />
                  <Label className="font-medium cursor-pointer">
                    {dayName}
                  </Label>
                </div>

                {dayHours.isAvailable && (
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <Label htmlFor={`start-${dayOfWeek}`} className="text-xs text-gray-600">
                        Start Time
                      </Label>
                      <Input
                        id={`start-${dayOfWeek}`}
                        type="time"
                        value={dayHours.startTime}
                        onChange={(e) =>
                          updateDay(dayOfWeek, "startTime", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>

                    <span className="text-gray-400 mt-6">to</span>

                    <div className="flex-1">
                      <Label htmlFor={`end-${dayOfWeek}`} className="text-xs text-gray-600">
                        End Time
                      </Label>
                      <Input
                        id={`end-${dayOfWeek}`}
                        type="time"
                        value={dayHours.endTime}
                        onChange={(e) =>
                          updateDay(dayOfWeek, "endTime", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {!dayHours.isAvailable && (
                  <p className="text-sm text-gray-500 md:flex-1">
                    Unavailable
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
          size="lg"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  )
}

"use client"

import { Download } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"

interface AddToCalendarButtonProps {
  title: string
  description: string
  location: string
  startTime: Date
  endTime: Date
}

export function AddToCalendarButton({
  title,
  description,
  location,
  startTime,
  endTime,
}: AddToCalendarButtonProps) {
  function generateICS() {
    const formatICSDate = (date: Date) => {
      return format(date, "yyyyMMdd'T'HHmmss")
    }

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Fitness Health//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@fitnesshealth.com`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(startTime)}`,
      `DTEND:${formatICSDate(endTime)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")

    const blob = new Blob([icsContent], { type: "text/calendar" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "fitness-health-appointment.ics"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={generateICS} className="w-full" variant="secondary">
      <Download className="mr-2 h-4 w-4" />
      Add to Calendar
    </Button>
  )
}

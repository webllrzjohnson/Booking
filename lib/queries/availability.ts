import { db } from "@/lib/db"
import { addMinutes, format, parse, isAfter, isBefore } from "date-fns"

export async function getAvailableTimeSlots(
  staffId: string,
  serviceId: string,
  date: Date
): Promise<Array<{ startTime: string; endTime: string }>> {
  const dayOfWeek = date.getDay()
  const normalizedDay = dayOfWeek === 0 ? 7 : dayOfWeek

  const workingHours = await db.workingHours.findUnique({
    where: {
      staffId_dayOfWeek: {
        staffId,
        dayOfWeek: normalizedDay,
      },
    },
  })

  if (!workingHours || !workingHours.isAvailable) {
    return []
  }

  const service = await db.service.findUnique({
    where: { id: serviceId },
    select: { durationMinutes: true },
  })

  if (!service) {
    return []
  }

  const dateStr = format(date, "yyyy-MM-dd")
  const startOfDay = new Date(`${dateStr}T00:00:00`)
  const endOfDay = new Date(`${dateStr}T23:59:59`)

  const existingBookings = await db.booking.findMany({
    where: {
      staffId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
    orderBy: {
      startTime: "asc",
    },
  })

  const startTime = parse(workingHours.startTime, "HH:mm", date)
  const endTime = parse(workingHours.endTime, "HH:mm", date)
  const slotDuration = 15
  const slots: Array<{ startTime: string; endTime: string }> = []

  let currentSlot = startTime

  while (
    isBefore(currentSlot, endTime) &&
    isBefore(
      addMinutes(currentSlot, service.durationMinutes),
      endTime
    ) ||
    addMinutes(currentSlot, service.durationMinutes).getTime() === endTime.getTime()
  ) {
    const slotEnd = addMinutes(currentSlot, service.durationMinutes)

    const isSlotAvailable = !existingBookings.some((booking) => {
      const bookingStart = booking.startTime
      const bookingEnd = booking.endTime

      return (
        (isAfter(currentSlot, bookingStart) || currentSlot.getTime() === bookingStart.getTime()) &&
        isBefore(currentSlot, bookingEnd)
      ) || (
        isAfter(slotEnd, bookingStart) &&
        (isBefore(slotEnd, bookingEnd) || slotEnd.getTime() === bookingEnd.getTime())
      ) || (
        (isBefore(currentSlot, bookingStart) || currentSlot.getTime() === bookingStart.getTime()) &&
        (isAfter(slotEnd, bookingEnd) || slotEnd.getTime() === bookingEnd.getTime())
      )
    })

    if (isSlotAvailable) {
      slots.push({
        startTime: currentSlot.toISOString(),
        endTime: slotEnd.toISOString(),
      })
    }

    currentSlot = addMinutes(currentSlot, slotDuration)
  }

  return slots
}

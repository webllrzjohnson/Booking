import { db } from "@/lib/db"
import { addMinutes, addDays, format, parse, isAfter, isBefore } from "date-fns"
import { toZonedTime, fromZonedTime } from "date-fns-tz"

const BUSINESS_TIMEZONE = "America/Toronto"

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
  
  const zonedStartOfDay = fromZonedTime(`${dateStr}T00:00:00`, BUSINESS_TIMEZONE)
  const zonedEndOfDay = fromZonedTime(`${dateStr}T23:59:59`, BUSINESS_TIMEZONE)

  const existingBookings = await db.booking.findMany({
    where: {
      staffId,
      startTime: {
        gte: zonedStartOfDay,
        lte: zonedEndOfDay,
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

  const startTime = fromZonedTime(`${dateStr}T${workingHours.startTime}:00`, BUSINESS_TIMEZONE)
  const endTime = fromZonedTime(`${dateStr}T${workingHours.endTime}:00`, BUSINESS_TIMEZONE)
  const slotDuration = 15
  const slots: Array<{ startTime: string; endTime: string }> = []

  let currentSlot = startTime
  const now = new Date()
  const isToday = format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")

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
      if (isToday && isBefore(currentSlot, now)) {
        currentSlot = addMinutes(currentSlot, slotDuration)
        continue
      }

      slots.push({
        startTime: currentSlot.toISOString(),
        endTime: slotEnd.toISOString(),
      })
    }

    currentSlot = addMinutes(currentSlot, slotDuration)
  }

  return slots
}

export async function getAvailableDatesInRange(
  staffId: string,
  serviceId: string,
  startDate: Date,
  endDate: Date
): Promise<string[]> {
  const availableDates: string[] = []
  let currentDate = new Date(startDate)
  currentDate.setHours(0, 0, 0, 0)

  const finalDate = new Date(endDate)
  finalDate.setHours(0, 0, 0, 0)

  while (currentDate <= finalDate) {
    const dayOfWeek = currentDate.getDay()

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const slots = await getAvailableTimeSlots(staffId, serviceId, currentDate)
      
      if (slots.length > 0) {
        availableDates.push(format(currentDate, "yyyy-MM-dd"))
      }
    }

    currentDate = addDays(currentDate, 1)
  }

  return availableDates
}

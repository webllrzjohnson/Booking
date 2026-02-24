"use server"

import { revalidatePath } from "next/cache"
import { addMinutes } from "date-fns"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types"

export async function rescheduleBookingAction(
  bookingId: string,
  newStartTime: string
): Promise<ActionResult<void>> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      select: {
        userId: true,
        serviceId: true,
        staffId: true,
        service: {
          select: {
            durationMinutes: true,
          },
        },
      },
    })

    if (!booking || booking.userId !== session.user.id) {
      return { success: false, error: "Booking not found" }
    }

    const newStart = new Date(newStartTime)
    const newEnd = addMinutes(newStart, booking.service.durationMinutes)

    const conflictingBooking = await db.booking.findFirst({
      where: {
        staffId: booking.staffId,
        startTime: {
          gte: newStart,
          lt: newEnd,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        id: {
          not: bookingId,
        },
      },
    })

    if (conflictingBooking) {
      return {
        success: false,
        error: "This time slot is no longer available",
      }
    }

    await db.booking.update({
      where: { id: bookingId },
      data: {
        startTime: newStart,
        endTime: newEnd,
      },
    })

    revalidatePath("/dashboard/bookings")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[rescheduleBookingAction]", error)
    return { success: false, error: "Failed to reschedule booking" }
  }
}

export async function cancelBookingAction(
  bookingId: string
): Promise<ActionResult<void>> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      select: {
        userId: true,
      },
    })

    if (!booking || booking.userId !== session.user.id) {
      return { success: false, error: "Booking not found" }
    }

    await db.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    })

    revalidatePath("/dashboard/bookings")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[cancelBookingAction]", error)
    return { success: false, error: "Failed to cancel booking" }
  }
}

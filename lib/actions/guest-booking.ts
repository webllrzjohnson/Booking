"use server"

import { db } from "@/lib/db"
import type { ActionResult } from "@/types"

export async function lookupGuestBookingAction(
  email: string,
  bookingRef: string
): Promise<ActionResult<any>> {
  try {
    const normalizedRef = bookingRef.toUpperCase().replace(/[^A-Z0-9]/g, "")

    const bookings = await db.booking.findMany({
      where: {
        guestEmail: email,
      },
      select: {
        id: true,
        guestName: true,
        guestEmail: true,
        guestPhone: true,
        startTime: true,
        endTime: true,
        status: true,
        notes: true,
        createdAt: true,
        service: {
          select: {
            name: true,
            durationMinutes: true,
            price: true,
          },
        },
        staff: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    const serializedBookings = bookings.map((booking) => ({
      ...booking,
      service: {
        ...booking.service,
        price: booking.service.price.toNumber(),
      },
    }))

    const matchingBooking = serializedBookings.find((b) =>
      b.id.toUpperCase().includes(normalizedRef) || 
      b.id.slice(-8).toUpperCase() === normalizedRef
    )

    if (!matchingBooking) {
      return {
        success: false,
        error: "Booking not found. Please check your email and reference number.",
      }
    }

    return { success: true, data: matchingBooking }
  } catch (error) {
    console.error("[lookupGuestBookingAction]", error)
    return { success: false, error: "Failed to lookup booking" }
  }
}

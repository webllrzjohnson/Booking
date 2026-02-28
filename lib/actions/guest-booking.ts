"use server"

import { db } from "@/lib/db"
import type { ActionResult } from "@/types"

export type GuestBookingLookupResult = {
  matchingBooking: {
    id: string
    guestName: string | null
    guestEmail: string | null
    guestPhone: string | null
    startTime: Date
    endTime: Date
    status: string
    notes: string | null
    createdAt: Date
    service: { name: string; durationMinutes: number; price: number }
    staff: { id: string; user: { name: string } }
  }
  otherUpcomingBookings: Array<{
    id: string
    guestName: string | null
    guestEmail: string | null
    guestPhone: string | null
    startTime: Date
    endTime: Date
    status: string
    notes: string | null
    createdAt: Date
    service: { name: string; durationMinutes: number; price: number }
    staff: { id: string; user: { name: string } }
  }>
}

export async function lookupGuestBookingAction(
  email: string,
  bookingRef: string
): Promise<ActionResult<GuestBookingLookupResult>> {
  try {
    const normalizedRef = bookingRef.toUpperCase().replace(/[^A-Z0-9]/g, "")
    const now = new Date()

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

    const otherUpcomingBookings = serializedBookings
      .filter(
        (b) =>
          b.id !== matchingBooking.id &&
          b.status !== "CANCELLED" &&
          new Date(b.startTime) >= now
      )
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )

    return {
      success: true,
      data: {
        matchingBooking,
        otherUpcomingBookings,
      },
    }
  } catch (error) {
    console.error("[lookupGuestBookingAction]", error)
    return { success: false, error: "Failed to lookup booking" }
  }
}

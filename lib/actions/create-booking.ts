"use server"

import bcrypt from "bcryptjs"
import { addMinutes } from "date-fns"

import { db } from "@/lib/db"
import { auth, signIn } from "@/lib/auth"
import type { ActionResult } from "@/types"

interface CreateBookingInput {
  serviceId: string
  staffId: string
  startTime: string
  endTime: string
  name: string
  email: string
  phone: string
  notes: string | null
  createAccount?: boolean
  password: string | null
}

export async function createBookingAction(
  input: CreateBookingInput
): Promise<ActionResult<{ bookingId: string }>> {
  try {
    const session = await auth()
    const startDate = new Date(input.startTime)
    const endDate = new Date(input.endTime)

    const [service, existingBookings] = await Promise.all([
      db.service.findUnique({
        where: { id: input.serviceId },
        select: { durationMinutes: true },
      }),
      db.booking.findMany({
        where: {
          staffId: input.staffId,
          startTime: {
            gte: startDate,
            lt: endDate,
          },
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      }),
    ])

    if (!service) {
      return { success: false, error: "Service not found" }
    }

    if (existingBookings.length > 0) {
      return {
        success: false,
        error: "This time slot is no longer available. Please select another time.",
      }
    }

    let userId = session?.user?.id

    if (!session && input.createAccount && input.password) {
      const existingUser = await db.user.findUnique({
        where: { email: input.email },
      })

      if (existingUser) {
        return {
          success: false,
          error: "Email already registered. Please log in instead.",
        }
      }

      const hashedPassword = await bcrypt.hash(input.password, 10)

      const newUser = await db.user.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          password: hashedPassword,
          role: "CUSTOMER",
        },
      })

      userId = newUser.id

      await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirect: false,
      })
    }

    const booking = await db.booking.create({
      data: {
        userId: userId || null,
        guestEmail: !userId ? input.email : null,
        guestName: !userId ? input.name : null,
        guestPhone: !userId ? input.phone : null,
        serviceId: input.serviceId,
        staffId: input.staffId,
        startTime: startDate,
        endTime: endDate,
        notes: input.notes,
        status: "CONFIRMED",
      },
    })

    return { success: true, data: { bookingId: booking.id } }
  } catch (error) {
    console.error("[createBookingAction]", error)
    return { success: false, error: "Failed to create booking" }
  }
}

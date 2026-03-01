import { db } from "@/lib/db"

export async function getBookingById(bookingId: string) {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      userId: true,
      guestEmail: true,
      guestName: true,
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

  if (!booking) return null

  return {
    ...booking,
    service: {
      ...booking.service,
      price: booking.service.price.toNumber(),
    },
  }
}

export async function getUserBookings(userId: string) {
  const bookings = await db.booking.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      serviceId: true,
      staffId: true,
      startTime: true,
      endTime: true,
      status: true,
      notes: true,
      createdAt: true,
      service: {
        select: {
          name: true,
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
    orderBy: {
      startTime: "desc",
    },
  })

  return bookings.map((booking) => ({
    ...booking,
    service: {
      ...booking.service,
      price: booking.service.price.toNumber(),
    },
  }))
}

export async function getGuestBooking(email: string, bookingId: string) {
  const booking = await db.booking.findFirst({
    where: {
      id: bookingId,
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

  if (!booking) return null

  return {
    ...booking,
    service: {
      ...booking.service,
      price: booking.service.price.toNumber(),
    },
  }
}

const STAFF_BOOKING_SELECT = {
  id: true,
  startTime: true,
  endTime: true,
  status: true,
  notes: true,
  guestName: true,
  guestEmail: true,
  guestPhone: true,
  user: {
    select: {
      name: true,
      email: true,
      phone: true,
    },
  },
  service: {
    select: {
      name: true,
    },
  },
} as const

export type StaffBookingItem = {
  id: string
  startTime: Date
  endTime: Date
  status: string
  notes: string | null
  guestName: string | null
  guestEmail: string | null
  guestPhone: string | null
  user: { name: string; email: string | null; phone: string | null } | null
  service: { name: string }
}

export async function getStaffUpcomingBookingsPaginated(
  staffId: string,
  page: number,
  pageSize: number
): Promise<{ bookings: StaffBookingItem[]; total: number }> {
  const now = new Date()

  const [bookings, total] = await Promise.all([
    db.booking.findMany({
      where: {
        staffId,
        startTime: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: STAFF_BOOKING_SELECT,
      orderBy: { startTime: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.booking.count({
      where: {
        staffId,
        startTime: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    }),
  ])

  return { bookings, total }
}

export async function getStaffBookings(
  staffId: string,
  startDate: Date,
  endDate: Date
) {
  return await db.booking.findMany({
    where: {
      staffId,
      startTime: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      notes: true,
      guestName: true,
      guestEmail: true,
      guestPhone: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  })
}

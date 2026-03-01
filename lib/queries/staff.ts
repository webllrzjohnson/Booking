import { db } from "@/lib/db"

export async function getStaffByService(serviceId: string) {
  const staffServices = await db.staffService.findMany({
    where: {
      serviceId,
    },
    select: {
      staff: {
        select: {
          id: true,
          bio: true,
          imageUrl: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  return staffServices.map((ss) => ({
    id: ss.staff.id,
    name: ss.staff.user.name,
    bio: ss.staff.bio,
    imageUrl: ss.staff.imageUrl,
  }))
}

export async function getStaffById(staffId: string) {
  const staff = await db.staff.findUnique({
    where: { id: staffId },
    select: {
      id: true,
      bio: true,
      imageUrl: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!staff) return null

  return {
    id: staff.id,
    userId: staff.user.id,
    name: staff.user.name,
    bio: staff.bio,
    imageUrl: staff.imageUrl,
  }
}

export async function getAllStaff() {
  const staff = await db.staff.findMany({
    orderBy: { user: { name: "asc" } },
    select: {
      id: true,
      bio: true,
      imageUrl: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      staffServices: {
        select: {
          service: {
            select: { name: true },
          },
        },
      },
    },
  })

  return staff.map((s) => ({
    id: s.id,
    name: s.user.name,
    email: s.user.email,
    bio: s.bio,
    imageUrl: s.imageUrl,
    services: s.staffServices.map((ss) => ss.service.name),
  }))
}

export async function getStaffWithDetails(staffId: string) {
  const staff = await db.staff.findUnique({
    where: { id: staffId },
    select: {
      id: true,
      bio: true,
      imageUrl: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      staffServices: {
        select: {
          serviceId: true,
        },
      },
      workingHours: true,
    },
  })

  if (!staff) return null

  const workingHoursMap: Record<number, { id: string; dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }> = {}
  staff.workingHours.forEach((wh) => {
    workingHoursMap[wh.dayOfWeek] = {
      id: wh.id,
      dayOfWeek: wh.dayOfWeek,
      startTime: wh.startTime,
      endTime: wh.endTime,
      isAvailable: wh.isAvailable,
    }
  })
  const workingHours = []
  for (let i = 1; i <= 7; i++) {
    workingHours.push(
      workingHoursMap[i] ?? {
        id: "",
        dayOfWeek: i,
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: false,
      }
    )
  }

  return {
    id: staff.id,
    userId: staff.user.id,
    name: staff.user.name,
    email: staff.user.email,
    bio: staff.bio,
    imageUrl: staff.imageUrl,
    serviceIds: staff.staffServices.map((ss) => ss.serviceId),
    workingHours,
  }
}

export async function getStaffByUserId(userId: string) {
  const staff = await db.staff.findUnique({
    where: { userId },
    select: {
      id: true,
      bio: true,
      imageUrl: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!staff) return null

  return {
    id: staff.id,
    name: staff.user.name,
    bio: staff.bio,
    imageUrl: staff.imageUrl,
  }
}

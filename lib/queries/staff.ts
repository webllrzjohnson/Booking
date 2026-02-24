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

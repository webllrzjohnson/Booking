import { db } from "@/lib/db"

export async function getServices() {
  return await db.service.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      durationMinutes: true,
      price: true,
    },
  })
}

export async function getServiceById(id: string) {
  return await db.service.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      durationMinutes: true,
      price: true,
    },
  })
}

export async function getServiceBySlug(slug: string) {
  return await db.service.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      durationMinutes: true,
      price: true,
    },
  })
}

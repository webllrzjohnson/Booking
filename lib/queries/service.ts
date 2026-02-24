import { db } from "@/lib/db"

export async function getServices() {
  const services = await db.service.findMany({
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

  return services.map((service) => ({
    ...service,
    price: service.price.toNumber(),
  }))
}

export async function getServiceById(id: string) {
  const service = await db.service.findUnique({
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

  if (!service) return null

  return {
    ...service,
    price: service.price.toNumber(),
  }
}

export async function getServiceBySlug(slug: string) {
  const service = await db.service.findUnique({
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

  if (!service) return null

  return {
    ...service,
    price: service.price.toNumber(),
  }
}

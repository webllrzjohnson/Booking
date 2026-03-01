import { db } from "@/lib/db"

export async function getUserProfileById(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      streetAddress: true,
      city: true,
      country: true,
      province: true,
      state: true,
      postalCode: true,
      zipCode: true,
      staffProfile: {
        select: {
          id: true,
          bio: true,
          imageUrl: true,
        },
      },
    },
  })

  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    streetAddress: user.streetAddress,
    city: user.city,
    country: user.country,
    province: user.province,
    state: user.state,
    postalCode: user.postalCode,
    zipCode: user.zipCode,
    staff: user.staffProfile
      ? {
          id: user.staffProfile.id,
          bio: user.staffProfile.bio,
          imageUrl: user.staffProfile.imageUrl,
        }
      : null,
  }
}

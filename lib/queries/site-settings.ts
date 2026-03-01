import { db } from "@/lib/db"

export async function getSiteSettings() {
  const settings = await db.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      siteName: true,
      logoUrl: true,
      heroImageUrl: true,
      primaryColor: true,
      secondaryColor: true,
      contactPhone: true,
      contactEmail: true,
      contactAddress: true,
    },
  })

  return settings ?? {
    id: "",
    siteName: "Fitness Health",
    logoUrl: null,
    heroImageUrl: null,
    primaryColor: "#2563eb",
    secondaryColor: "#0d9488",
    contactPhone: null,
    contactEmail: null,
    contactAddress: null,
  }
}

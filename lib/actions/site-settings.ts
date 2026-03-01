"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types"
import {
  UpdateSiteSettingsSchema,
  type UpdateSiteSettingsInput,
} from "@/lib/schemas/site-settings"

export async function updateSiteSettingsAction(
  input: UpdateSiteSettingsInput
): Promise<ActionResult<void>> {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" }
  }

  const parsed = UpdateSiteSettingsSchema.safeParse(input)
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors
    const message = Object.values(first)[0]?.[0] ?? "Invalid input"
    return { success: false, error: message }
  }

  try {
    const data = {
      ...parsed.data,
      contactPhone: parsed.data.contactPhone || null,
      contactEmail: parsed.data.contactEmail || null,
      contactAddress: parsed.data.contactAddress || null,
      logoUrl: parsed.data.logoUrl || null,
      heroImageUrl: parsed.data.heroImageUrl || null,
    }

    const existing = await db.siteSettings.findFirst()
    if (existing) {
      await db.siteSettings.update({
        where: { id: existing.id },
        data,
      })
    } else {
      await db.siteSettings.create({
        data,
      })
    }

    revalidatePath("/")
    revalidatePath("/services")
    revalidatePath("/book")
    revalidatePath("/dashboard/admin/settings")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateSiteSettingsAction]", error)
    return { success: false, error: "Failed to update settings" }
  }
}

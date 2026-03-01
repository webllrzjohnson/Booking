"use server"

import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types"
import {
  ChangePasswordSchema,
  UpdateProfileSchema,
  UpdateStaffProfileSchema,
  type ChangePasswordInput,
  type UpdateProfileInput,
  type UpdateStaffProfileInput,
} from "@/lib/schemas/profile"

export async function changePasswordAction(
  input: ChangePasswordInput
): Promise<ActionResult<void>> {
  const parsed = ChangePasswordSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.currentPassword?.[0] ?? "Invalid input",
    }
  }

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return { success: false, error: "User not found" }
    }

    const isValid = await bcrypt.compare(
      parsed.data.currentPassword,
      user.password
    )
    if (!isValid) {
      return { success: false, error: "Current password is incorrect" }
    }

    const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10)
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    revalidatePath("/dashboard/staff/profile")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[changePasswordAction]", error)
    return { success: false, error: "Failed to change password" }
  }
}

export async function updateProfileAction(
  input: UpdateProfileInput
): Promise<ActionResult<void>> {
  const parsed = UpdateProfileSchema.safeParse(input)
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors.name?.[0]
    return { success: false, error: first ?? "Invalid input" }
  }

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const toNull = (v: string | undefined | null) =>
      (v?.trim() || null) as string | null

    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name.trim(),
        phone: toNull(parsed.data.phone),
        streetAddress: toNull(parsed.data.streetAddress),
        city: toNull(parsed.data.city),
        country: toNull(parsed.data.country),
        province: toNull(parsed.data.province),
        state: toNull(parsed.data.state),
        postalCode: toNull(parsed.data.postalCode),
        zipCode: toNull(parsed.data.zipCode),
      },
    })

    revalidatePath("/dashboard/staff/profile")
    revalidatePath("/dashboard")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateProfileAction]", error)
    return { success: false, error: "Failed to update profile" }
  }
}

export async function updateStaffProfileAction(
  input: UpdateStaffProfileInput
): Promise<ActionResult<void>> {
  const parsed = UpdateStaffProfileSchema.safeParse(input)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    const first =
      errors.imageUrl?.[0] ?? errors.bio?.[0] ?? "Invalid input"
    return { success: false, error: first }
  }

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const staff = await db.staff.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  })

  if (!staff) {
    return { success: false, error: "Staff profile not found" }
  }

  try {
    const updates: { bio?: string; imageUrl?: string | null } = {}
    if (parsed.data.bio !== undefined) updates.bio = parsed.data.bio
    if (parsed.data.imageUrl !== undefined) {
      updates.imageUrl = parsed.data.imageUrl || null
    }

    if (Object.keys(updates).length > 0) {
      await db.staff.update({
        where: { id: staff.id },
        data: updates,
      })
    }

    revalidatePath("/dashboard/staff/profile")
    revalidatePath("/dashboard")
    revalidatePath("/book")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateStaffProfileAction]", error)
    return { success: false, error: "Failed to update profile" }
  }
}

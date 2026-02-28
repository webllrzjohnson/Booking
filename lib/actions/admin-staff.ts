"use server"

import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types"
import {
  CreateStaffSchema,
  UpdateStaffSchema,
  type CreateStaffInput,
  type UpdateStaffInput,
} from "@/lib/schemas/staff"

export async function createStaffAction(
  input: CreateStaffInput
): Promise<ActionResult<{ staffId: string }>> {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const existingUser = await db.user.findUnique({
      where: { email: input.email },
    })

    if (existingUser) {
      return { success: false, error: "A user with this email already exists" }
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: "STAFF",
          emailVerifiedAt: new Date(),
        },
      })

      const staff = await tx.staff.create({
        data: {
          userId: user.id,
          bio: input.bio,
        },
      })

      return { staffId: staff.id }
    })

    revalidatePath("/dashboard/admin")
    revalidatePath("/dashboard/admin/staff")

    return { success: true, data: result }
  } catch (error) {
    console.error("[createStaffAction]", error)
    return { success: false, error: "Failed to create staff" }
  }
}

export async function updateStaffAction(
  staffId: string,
  input: UpdateStaffInput
): Promise<ActionResult<void>> {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const staff = await db.staff.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        staffServices: { select: { serviceId: true } },
      },
    })

    if (!staff) {
      return { success: false, error: "Staff not found" }
    }

    await db.$transaction(async (tx) => {
      if (input.bio !== undefined) {
        await tx.staff.update({
          where: { id: staffId },
          data: { bio: input.bio },
        })
      }

      if (input.imageUrl !== undefined) {
        await tx.staff.update({
          where: { id: staffId },
          data: { imageUrl: input.imageUrl || null },
        })
      }

      if (input.serviceIds !== undefined) {
        await tx.staffService.deleteMany({
          where: { staffId },
        })

        if (input.serviceIds.length > 0) {
          await tx.staffService.createMany({
            data: input.serviceIds.map((serviceId) => ({
              staffId,
              serviceId,
            })),
          })
        }
      }
    })

    revalidatePath("/dashboard/admin")
    revalidatePath("/dashboard/admin/staff")
    revalidatePath(`/dashboard/admin/staff/${staffId}`)
    revalidatePath("/book")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateStaffAction]", error)
    return { success: false, error: "Failed to update staff" }
  }
}

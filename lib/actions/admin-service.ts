"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import {
  CreateServiceSchema,
  UpdateServiceSchema,
  type CreateServiceInput,
  type UpdateServiceInput,
} from "@/lib/schemas/service"
import type { ActionResult } from "@/types"

export async function createServiceAction(
  input: CreateServiceInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = CreateServiceSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "Invalid input",
      }
    }

    const session = await auth()

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const existing = await db.service.findUnique({
      where: { slug: input.slug },
    })

    if (existing) {
      return { success: false, error: "A service with this slug already exists" }
    }

    const { name, slug, description, durationMinutes, price } = parsed.data

    const service = await db.service.create({
      data: {
        name,
        slug,
        description,
        durationMinutes,
        price,
        isActive: true,
      },
    })

    revalidatePath("/dashboard/admin")
    revalidatePath("/dashboard/admin/services")
    revalidatePath("/book")
    revalidatePath("/services")

    return { success: true, data: { id: service.id } }
  } catch (error) {
    console.error("[createServiceAction]", error)
    return { success: false, error: "Failed to create service" }
  }
}

export async function updateServiceAction(
  id: string,
  input: UpdateServiceInput
): Promise<ActionResult<void>> {
  try {
    const parsed = UpdateServiceSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? "Invalid input",
      }
    }

    const session = await auth()

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const service = await db.service.findUnique({
      where: { id },
    })

    if (!service) {
      return { success: false, error: "Service not found" }
    }

    const data = parsed.data

    if (data.slug && data.slug !== service.slug) {
      const existing = await db.service.findUnique({
        where: { slug: data.slug },
      })
      if (existing) {
        return { success: false, error: "A service with this slug already exists" }
      }
    }

    await db.service.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.durationMinutes !== undefined && {
          durationMinutes: data.durationMinutes,
        }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })

    revalidatePath("/dashboard/admin")
    revalidatePath("/dashboard/admin/services")
    revalidatePath("/book")
    revalidatePath("/services")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateServiceAction]", error)
    return { success: false, error: "Failed to update service" }
  }
}

export async function deactivateServiceAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const service = await db.service.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!service) {
      return { success: false, error: "Service not found" }
    }

    await db.service.update({
      where: { id },
      data: { isActive: false },
    })

    revalidatePath("/dashboard/admin")
    revalidatePath("/dashboard/admin/services")
    revalidatePath("/book")
    revalidatePath("/services")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[deactivateServiceAction]", error)
    return { success: false, error: "Failed to deactivate service" }
  }
}

export async function activateServiceAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const session = await auth()

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    const service = await db.service.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!service) {
      return { success: false, error: "Service not found" }
    }

    await db.service.update({
      where: { id },
      data: { isActive: true },
    })

    revalidatePath("/dashboard/admin")
    revalidatePath("/dashboard/admin/services")
    revalidatePath("/book")
    revalidatePath("/services")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[activateServiceAction]", error)
    return { success: false, error: "Failed to activate service" }
  }
}

"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types"

interface WorkingHourUpdate {
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export async function updateWorkingHoursAction(
  staffId: string,
  updates: WorkingHourUpdate[]
): Promise<ActionResult<void>> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    if (session.user.role !== "STAFF" && session.user.role !== "ADMIN") {
      return { success: false, error: "Insufficient permissions" }
    }

    const staff = await db.staff.findUnique({
      where: { id: staffId },
      select: { userId: true },
    })

    if (!staff || staff.userId !== session.user.id) {
      return { success: false, error: "Unauthorized" }
    }

    for (const update of updates) {
      await db.workingHours.upsert({
        where: {
          staffId_dayOfWeek: {
            staffId,
            dayOfWeek: update.dayOfWeek,
          },
        },
        create: {
          staffId,
          dayOfWeek: update.dayOfWeek,
          startTime: update.startTime,
          endTime: update.endTime,
          isAvailable: update.isAvailable,
        },
        update: {
          startTime: update.startTime,
          endTime: update.endTime,
          isAvailable: update.isAvailable,
        },
      })
    }

    revalidatePath("/dashboard/staff/availability")
    return { success: true, data: undefined }
  } catch (error) {
    console.error("[updateWorkingHoursAction]", error)
    return { success: false, error: "Failed to update availability" }
  }
}

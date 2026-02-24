"use server"

import { getAvailableTimeSlots } from "@/lib/queries/availability"
import type { ActionResult } from "@/types"

export async function getAvailableSlotsAction(
  staffId: string,
  serviceId: string,
  date: Date
): Promise<ActionResult<Array<{ startTime: string; endTime: string }>>> {
  try {
    const slots = await getAvailableTimeSlots(staffId, serviceId, date)
    return { success: true, data: slots }
  } catch (error) {
    console.error("[getAvailableSlotsAction]", error)
    return { success: false, error: "Failed to fetch available time slots" }
  }
}

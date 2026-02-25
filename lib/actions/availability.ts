"use server"

import { getAvailableTimeSlots, getAvailableDatesInRange } from "@/lib/queries/availability"
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

export async function getAvailableDatesAction(
  staffId: string,
  serviceId: string,
  startDate: Date,
  endDate: Date
): Promise<ActionResult<string[]>> {
  try {
    const dates = await getAvailableDatesInRange(staffId, serviceId, startDate, endDate)
    return { success: true, data: dates }
  } catch (error) {
    console.error("[getAvailableDatesAction]", error)
    return { success: false, error: "Failed to fetch available dates" }
  }
}

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

export type UserRole = "CUSTOMER" | "STAFF" | "ADMIN"

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"

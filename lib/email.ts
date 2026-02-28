import { Resend } from "resend"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Fitness Health <onboarding@resend.dev>"
const BUSINESS_TIMEZONE = "America/Toronto"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export async function sendPasswordResetEmail(params: {
  email: string
  name: string
  token: string
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[sendPasswordResetEmail] RESEND_API_KEY is not set")
    return { success: false, error: "Email service is not configured" }
  }

  const resetUrl = `${APP_URL}/reset-password?token=${params.token}`
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: "Reset your password - Fitness Health",
    html: `
      <p>Hi ${params.name},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    `,
  })

  if (error) {
    console.error("[sendPasswordResetEmail]", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function sendVerificationEmail(params: {
  email: string
  name: string
  token: string
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[sendVerificationEmail] RESEND_API_KEY is not set")
    return { success: false, error: "Email service is not configured" }
  }

  const verifyUrl = `${APP_URL}/verify-email?token=${params.token}`
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: "Verify your email - Fitness Health",
    html: `
      <p>Hi ${params.name},</p>
      <p>Thanks for signing up. Please verify your email address by clicking the link below:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
    `,
  })

  if (error) {
    console.error("[sendVerificationEmail]", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function sendBookingConfirmationEmail(params: {
  email: string
  name: string
  serviceName: string
  staffName: string
  startTime: Date
  referenceCode: string
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[sendBookingConfirmationEmail] RESEND_API_KEY is not set")
    return { success: false, error: "Email service is not configured" }
  }

  const zonedStart = toZonedTime(params.startTime, BUSINESS_TIMEZONE)
  const dateStr = format(zonedStart, "EEEE, MMMM d, yyyy")
  const timeStr = format(zonedStart, "h:mm a")
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: `Booking confirmed - ${params.serviceName}`,
    html: `
      <p>Hi ${params.name},</p>
      <p>Your appointment has been confirmed.</p>
      <p><strong>Ref: ${params.referenceCode}</strong></p>
      <p><strong>${params.serviceName}</strong> with ${params.staffName}</p>
      <p>${dateStr} at ${timeStr}</p>
      <p>Need to make changes? <a href="${APP_URL}/dashboard/bookings">View your bookings</a></p>
    `,
  })

  if (error) {
    console.error("[sendBookingConfirmationEmail]", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function sendBookingCancellationEmail(params: {
  email: string
  name: string
  serviceName: string
  staffName: string
  startTime: Date
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[sendBookingCancellationEmail] RESEND_API_KEY is not set")
    return { success: false, error: "Email service is not configured" }
  }

  const zonedStart = toZonedTime(params.startTime, BUSINESS_TIMEZONE)
  const dateStr = format(zonedStart, "EEEE, MMMM d, yyyy")
  const timeStr = format(zonedStart, "h:mm a")
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: `Booking cancelled - ${params.serviceName}`,
    html: `
      <p>Hi ${params.name},</p>
      <p>Your appointment has been cancelled.</p>
      <p><strong>${params.serviceName}</strong> with ${params.staffName}</p>
      <p>Was scheduled for ${dateStr} at ${timeStr}</p>
      <p><a href="${APP_URL}">Book a new appointment</a></p>
    `,
  })

  if (error) {
    console.error("[sendBookingCancellationEmail]", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

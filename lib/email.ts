import { Resend } from "resend"

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Fitness Health <onboarding@resend.dev>"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

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

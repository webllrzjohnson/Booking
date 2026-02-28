import type { Metadata } from "next"
import Link from "next/link"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Reset Password - Fitness Health",
  description: "Set a new password for your Fitness Health account.",
}

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string; reset?: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token, reset } = await searchParams

  if (reset === "1") {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Password reset</h1>
          <p className="text-gray-600">
            Your password has been updated. You can now log in with your new
            password.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Log in
        </Link>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Invalid link</h1>
        <p className="text-gray-600">
          This reset link is invalid. Request a new one from the forgot password
          page.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block font-medium text-blue-600 hover:underline"
        >
          Forgot password
        </Link>
      </div>
    )
  }

  const user = await db.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpiresAt: { gt: new Date() },
    },
  })

  if (!user) {
    return (
      <div className="space-y-6 text-center">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
          Invalid or expired reset link
        </div>
        <p className="text-sm text-gray-600">
          The link may have expired. Request a new password reset from the forgot
          password page.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block font-medium text-blue-600 hover:underline"
        >
          Forgot password
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Set new password</h1>
        <p className="text-gray-600">
          Enter your new password below. It must be at least 8 characters.
        </p>
      </div>

      <ResetPasswordForm token={token} />

      <p className="text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}

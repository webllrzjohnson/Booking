import type { Metadata } from "next"
import Link from "next/link"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password - Fitness Health",
  description: "Request a password reset link for your Fitness Health account.",
}

interface ForgotPasswordPageProps {
  searchParams: Promise<{ sent?: string }>
}

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { sent } = await searchParams

  if (sent === "1") {
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="text-gray-600">
            If an account exists for that email, we sent a password reset link.
            The link expires in 1 hour.
          </p>
          <p className="text-sm text-gray-500">
            Didn&apos;t receive it? Check your spam folder.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block font-medium text-blue-600 hover:underline"
        >
          Back to log in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Forgot password?</h1>
        <p className="text-gray-600">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <ForgotPasswordForm />

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

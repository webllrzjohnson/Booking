import type { Metadata } from "next"
import Link from "next/link"

import { verifyEmailAction } from "@/lib/actions/auth"

export const metadata: Metadata = {
  title: "Verify Email - Fitness Health",
  description: "Verify your email address to activate your account.",
}

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string; sent?: string }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token, sent } = await searchParams

  if (sent === "1") {
    return (
      <div className="space-y-6 text-center">
        <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-600"
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
            We sent a verification link to your email address. Click the link to
            activate your account.
          </p>
          <p className="text-sm text-gray-500">
            The link expires in 24 hours. Didn&apos;t receive it? Check your spam
            folder.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block text-blue-600 font-medium hover:underline"
        >
          Back to log in
        </Link>
      </div>
    )
  }

  if (token) {
    const result = await verifyEmailAction(token)

    if (result.success) {
      return (
        <div className="space-y-6 text-center">
          <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
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
            <h1 className="text-2xl font-bold text-gray-900">Email verified</h1>
            <p className="text-gray-600">
              Your account is now active. You can log in to start booking
              appointments.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Log in
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-6 text-center">
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-red-600">
          {result.error}
        </div>
        <p className="text-sm text-gray-600">
          The link may have expired. You can request a new one by signing up
          again with the same email.
        </p>
        <Link
          href="/signup"
          className="inline-block text-blue-600 font-medium hover:underline"
        >
          Sign up again
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
      <p className="text-gray-600">
        Use the link we sent to your email to verify your account. If you
        haven&apos;t signed up yet, start by creating an account.
      </p>
      <Link
        href="/signup"
        className="inline-block text-blue-600 font-medium hover:underline"
      >
        Sign up
      </Link>
    </div>
  )
}

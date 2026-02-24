import type { Metadata } from "next"
import Link from "next/link"

import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up - Fitness Health",
  description: "Create your Fitness Health account to book and manage appointments.",
}

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600">
          Sign up to book appointments and manage your health journey
        </p>
      </div>

      <SignupForm />

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

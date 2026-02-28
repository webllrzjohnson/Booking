"use server"

import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { randomBytes } from "node:crypto"

import { db } from "@/lib/db"
import { signIn, signOut } from "@/lib/auth"
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email"
import type { ActionResult } from "@/types"

const VERIFICATION_TOKEN_EXPIRY_HOURS = 24
const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1

export async function loginAction(
  email: string,
  password: string
): Promise<ActionResult<void>> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { success: false, error: "Invalid email or password" }
      }
    }
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function signupAction(data: {
  name: string
  email: string
  phone: string | null
  password: string
}): Promise<ActionResult<void>> {
  try {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS)

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "CUSTOMER",
        emailVerificationToken: token,
        emailVerificationExpiresAt: expiresAt,
      },
    })

    const emailResult = await sendVerificationEmail({
      email: data.email,
      name: data.name,
      token,
    })

    if (!emailResult.success) {
      await db.user.delete({ where: { id: user.id } })
      return {
        success: false,
        error: emailResult.error ?? "Failed to send verification email",
      }
    }

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[signupAction]", error)
    return { success: false, error: "Failed to create account" }
  }
}

export async function verifyEmailAction(
  token: string
): Promise<ActionResult<void>> {
  try {
    const user = await db.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiresAt: { gt: new Date() },
      },
    })

    if (!user) {
      return { success: false, error: "Invalid or expired verification link" }
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
      },
    })

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[verifyEmailAction]", error)
    return { success: false, error: "Verification failed" }
  }
}

export async function logoutAction() {
  await signOut({ redirect: false })
}

export async function forgotPasswordAction(
  email: string
): Promise<ActionResult<void>> {
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    })

    if (!user) {
      return { success: true, data: undefined }
    }

    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS)

    await db.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpiresAt: expiresAt,
      },
    })

    const emailResult = await sendPasswordResetEmail({
      email,
      name: user.name,
      token,
    })

    if (!emailResult.success) {
      await db.user.update({
        where: { id: user.id },
        data: { passwordResetToken: null, passwordResetExpiresAt: null },
      })
      return {
        success: false,
        error: emailResult.error ?? "Failed to send reset email",
      }
    }

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[forgotPasswordAction]", error)
    return { success: false, error: "Something went wrong" }
  }
}

export async function resetPasswordAction(data: {
  token: string
  password: string
}): Promise<ActionResult<void>> {
  try {
    const user = await db.user.findFirst({
      where: {
        passwordResetToken: data.token,
        passwordResetExpiresAt: { gt: new Date() },
      },
    })

    if (!user) {
      return { success: false, error: "Invalid or expired reset link" }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
      },
    })

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[resetPasswordAction]", error)
    return { success: false, error: "Failed to reset password" }
  }
}

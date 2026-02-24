"use server"

import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

import { db } from "@/lib/db"
import { signIn, signOut } from "@/lib/auth"
import type { ActionResult } from "@/types"

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

    await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    })

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[signupAction]", error)
    return { success: false, error: "Failed to create account" }
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}

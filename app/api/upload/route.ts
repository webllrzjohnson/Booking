import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const isAdmin = session.user.role === "ADMIN"

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 }
    )
  }

  const file = formData.get("file") as File | null
  const type = formData.get("type") as string | null
  const staffId = formData.get("staffId") as string | null

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    )
  }

  const validTypes = ["logo", "hero", "staff"]
  if (!type || !validTypes.includes(type)) {
    return NextResponse.json(
      { error: "Invalid type. Use logo, hero, or staff" },
      { status: 400 }
    )
  }

  if (type === "staff" && !staffId) {
    return NextResponse.json(
      { error: "staffId required for staff uploads" },
      { status: 400 }
    )
  }

  if (!isAdmin) {
    if (type !== "staff" || !staffId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const staff = await db.staff.findFirst({
      where: { id: staffId, userId: session.user.id },
      select: { id: true },
    })
    if (!staff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Use JPEG, PNG, or WebP" },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Max 5MB" },
      { status: 400 }
    )
  }

  const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp"
  const filename = type === "staff" ? `${staffId}.${ext}` : `${type}.${ext}`

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    type === "staff" ? "staff" : ""
  )
  const filePath = path.join(uploadDir, filename)

  try {
    await mkdir(uploadDir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)
  } catch (error) {
    console.error("[upload]", error)
    return NextResponse.json(
      { error: "Failed to save file" },
      { status: 500 }
    )
  }

  const url =
    type === "staff"
      ? `/uploads/staff/${filename}`
      : `/uploads/${filename}`

  return NextResponse.json({ url })
}

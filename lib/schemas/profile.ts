import { z } from "zod"

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  zipCode: z.string().optional(),
})

const imageUrlSchema = z.union([
  z.string().url(),
  z.string().regex(/^\/[^\s]*$/, { message: "Invalid url" }),
  z.literal(""),
])

export const UpdateStaffProfileSchema = z.object({
  bio: z.string().min(1, "Bio is required").optional(),
  imageUrl: imageUrlSchema.optional(),
})

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
export type UpdateStaffProfileInput = z.infer<typeof UpdateStaffProfileSchema>

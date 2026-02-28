import { z } from "zod"

export const CreateStaffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bio: z.string().min(1, "Bio is required"),
})

export const UpdateStaffSchema = z.object({
  bio: z.string().min(1).optional(),
  imageUrl: z.union([z.string().url(), z.literal("")]).optional(),
  serviceIds: z.array(z.string().cuid()).default([]),
})

export type CreateStaffInput = z.infer<typeof CreateStaffSchema>
export type UpdateStaffInput = z.infer<typeof UpdateStaffSchema>

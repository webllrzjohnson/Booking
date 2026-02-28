import { z } from "zod"

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const CreateServiceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(slugRegex, "Slug must be lowercase, alphanumeric with hyphens only"),
  description: z.string().min(1, "Description is required"),
  durationMinutes: z.number().min(5).max(480),
  price: z.number().min(0),
})

export const UpdateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().regex(slugRegex).optional(),
  description: z.string().optional(),
  durationMinutes: z.number().min(5).max(480).optional(),
  price: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
})

export type CreateServiceInput = z.infer<typeof CreateServiceSchema>
export type UpdateServiceInput = z.infer<typeof UpdateServiceSchema>

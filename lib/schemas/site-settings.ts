import { z } from "zod"

const optionalUrl = z
  .union([
    z.string().url(),
    z.string().regex(/^\/[^/]/), // allow /uploads/... paths
    z.literal(""),
  ])
  .optional()
  .transform((v) => (v === "" ? undefined : v))

export const UpdateSiteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(100),
  logoUrl: optionalUrl,
  heroImageUrl: optionalUrl,
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  contactPhone: z.string().max(50).optional(),
  contactEmail: z.union([z.string().email(), z.literal("")]).optional(),
  contactAddress: z.string().max(200).optional(),
})

export type UpdateSiteSettingsInput = z.infer<typeof UpdateSiteSettingsSchema>

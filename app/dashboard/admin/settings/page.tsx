import Link from "next/link"

import { getSiteSettings } from "@/lib/queries/site-settings"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsFormWrapper } from "./settings-form-wrapper"

export const metadata = {
  title: "Site Settings - Admin - Fitness Health",
  description: "Customize site appearance and contact info.",
}

export default async function AdminSettingsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard/bookings")
  }

  const settings = await getSiteSettings()

  const defaultValues = {
    siteName: settings.siteName,
    logoUrl: settings.logoUrl ?? "",
    heroImageUrl: settings.heroImageUrl ?? "",
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    contactPhone: settings.contactPhone ?? "",
    contactEmail: settings.contactEmail ?? "",
    contactAddress: settings.contactAddress ?? "",
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/admin"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Admin
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Site Settings</h1>
        <p className="text-gray-600">
          Customize your clinic&apos;s appearance and contact information.
        </p>
      </div>

      <div className="max-w-2xl">
        <SettingsFormWrapper defaultValues={defaultValues} />
      </div>
    </div>
  )
}

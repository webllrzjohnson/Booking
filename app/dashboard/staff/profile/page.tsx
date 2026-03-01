import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getUserProfileById } from "@/lib/queries/user"
import { getStaffByUserId } from "@/lib/queries/staff"
import { ProfileSettingsForm } from "@/components/staff/profile-settings-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const metadata: Metadata = {
  title: "Profile & Settings - Fitness Health",
  description: "Update your profile, avatar, and password.",
}

export default async function StaffProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  if (session.user.role !== "STAFF" && session.user.role !== "ADMIN") {
    redirect("/dashboard/bookings")
  }

  const profile = await getUserProfileById(session.user.id)
  const staff = await getStaffByUserId(session.user.id)

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
        <p className="text-gray-600">Unable to load your profile.</p>
      </div>
    )
  }

  if (!staff) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Staff Profile Not Found</h1>
        <p className="text-gray-600">Your account is not linked to a staff profile.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
          <p className="text-gray-600">
            Update your profile, avatar, and password.
          </p>
        </div>
        <Avatar className="h-20 w-20 shrink-0 ring-2 ring-muted">
          <AvatarImage src={staff.imageUrl || undefined} alt={profile.name} />
          <AvatarFallback className="text-xl">
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </div>

      <ProfileSettingsForm
        profile={{
          name: profile.name,
          email: profile.email,
          phone: profile.phone ?? "",
          streetAddress: profile.streetAddress ?? "",
          city: profile.city ?? "",
          country: profile.country ?? "",
          province: profile.province ?? "",
          state: profile.state ?? "",
          postalCode: profile.postalCode ?? "",
          zipCode: profile.zipCode ?? "",
        }}
        staff={{
          id: staff.id,
          bio: staff.bio,
          imageUrl: staff.imageUrl ?? "",
        }}
      />
    </div>
  )
}

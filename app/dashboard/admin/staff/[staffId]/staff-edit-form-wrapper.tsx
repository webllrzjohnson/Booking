"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { StaffFormEdit } from "@/components/admin/staff-form"
import { updateStaffAction } from "@/lib/actions/admin-staff"
import type { UpdateStaffInput } from "@/lib/schemas/staff"

type StaffEditFormWrapperProps = {
  staffId: string
  defaultValues: {
    bio: string
    imageUrl: string | null
    serviceIds: string[]
  }
  services: { id: string; name: string }[]
}

export function StaffEditFormWrapper({
  staffId,
  defaultValues,
  services,
}: StaffEditFormWrapperProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <StaffFormEdit
      defaultValues={defaultValues}
      services={services}
      onSubmit={async (data: UpdateStaffInput) => {
        setIsSubmitting(true)
        try {
          const result = await updateStaffAction(staffId, data)
          if (result.success) {
            router.refresh()
          } else {
            throw new Error(result.error)
          }
        } finally {
          setIsSubmitting(false)
        }
      }}
      isSubmitting={isSubmitting}
    />
  )
}

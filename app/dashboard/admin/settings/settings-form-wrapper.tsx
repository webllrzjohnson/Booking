"use client"

import { useState } from "react"
import { toast } from "sonner"

import { SettingsForm } from "@/components/admin/settings-form"
import { updateSiteSettingsAction } from "@/lib/actions/site-settings"
import type { UpdateSiteSettingsInput } from "@/lib/schemas/site-settings"

type SettingsFormWrapperProps = {
  defaultValues: UpdateSiteSettingsInput
}

export function SettingsFormWrapper({ defaultValues }: SettingsFormWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: UpdateSiteSettingsInput) {
    setIsSubmitting(true)
    const result = await updateSiteSettingsAction(data)
    setIsSubmitting(false)

    if (result.success) {
      toast.success("Settings saved")
    } else {
      toast.error(result.error)
    }
  }

  return (
    <SettingsForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}

"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  UpdateSiteSettingsSchema,
  type UpdateSiteSettingsInput,
} from "@/lib/schemas/site-settings"

type SettingsFormProps = {
  defaultValues: UpdateSiteSettingsInput
  onSubmit: (data: UpdateSiteSettingsInput) => Promise<void>
  isSubmitting: boolean
}

export function SettingsForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: SettingsFormProps) {
  const logoInputRef = useRef<HTMLInputElement>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [heroUploading, setHeroUploading] = useState(false)
  const form = useForm<UpdateSiteSettingsInput>({
    resolver: zodResolver(UpdateSiteSettingsSchema),
    defaultValues,
  })

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file?.type.startsWith("image/")) return
    setLogoUploading(true)
    form.clearErrors("logoUrl")
    try {
      const formData = new FormData()
      formData.set("file", file)
      formData.set("type", "logo")
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Upload failed")
      form.setValue("logoUrl", data.url)
    } catch (err) {
      form.setError("logoUrl", {
        message: err instanceof Error ? err.message : "Upload failed",
      })
    } finally {
      setLogoUploading(false)
      e.target.value = ""
    }
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file?.type.startsWith("image/")) return
    setHeroUploading(true)
    form.clearErrors("heroImageUrl")
    try {
      const formData = new FormData()
      formData.set("file", file)
      formData.set("type", "hero")
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Upload failed")
      form.setValue("heroImageUrl", data.url)
    } catch (err) {
      form.setError("heroImageUrl", {
        message: err instanceof Error ? err.message : "Upload failed",
      })
    } finally {
      setHeroUploading(false)
      e.target.value = ""
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="siteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Fitness Health" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded border border-gray-300"
                      aria-label="Primary color"
                    />
                    <Input
                      {...field}
                      className="font-mono text-sm"
                      placeholder="#2563eb"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded border border-gray-300"
                      aria-label="Secondary color"
                    />
                    <Input
                      {...field}
                      className="font-mono text-sm"
                      placeholder="#0d9488"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <div className="flex gap-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleLogoUpload}
                  aria-label="Upload logo"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={logoUploading}
                  onClick={() => logoInputRef.current?.click()}
                >
                  {logoUploading ? "Uploading..." : "Upload"}
                </Button>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Or paste URL"
                    className="flex-1"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="heroImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Image</FormLabel>
              <div className="flex gap-2">
                <input
                  ref={heroInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleHeroUpload}
                  aria-label="Upload hero image"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={heroUploading}
                  onClick={() => heroInputRef.current?.click()}
                >
                  {heroUploading ? "Uploading..." : "Upload"}
                </Button>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Or paste URL"
                    className="flex-1"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold">Contact Info</h3>
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="(555) 123-4567" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="email"
                    placeholder="info@clinic.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="123 Wellness Street"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  )
}

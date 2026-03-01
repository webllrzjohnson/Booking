"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CreateStaffSchema,
  UpdateStaffSchema,
  type CreateStaffInput,
  type UpdateStaffInput,
} from "@/lib/schemas/staff"

type ServiceOption = {
  id: string
  name: string
}

type StaffFormCreateProps = {
  onSubmit: (data: CreateStaffInput) => Promise<void>
  isSubmitting: boolean
}

export function StaffFormCreate({ onSubmit, isSubmitting }: StaffFormCreateProps) {
  const form = useForm<CreateStaffInput>({
    resolver: zodResolver(CreateStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      bio: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Sarah Chen" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} placeholder="sarah@clinic.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} placeholder="••••••••" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} placeholder="Brief professional bio..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Staff"}
        </Button>
      </form>
    </Form>
  )
}

type StaffFormEditProps = {
  staffId: string
  defaultValues: {
    bio: string
    imageUrl: string | null
    serviceIds: string[]
  }
  services: ServiceOption[]
  onSubmit: (data: UpdateStaffInput) => Promise<void>
  isSubmitting: boolean
}

export function StaffFormEdit({
  staffId,
  defaultValues,
  services,
  onSubmit,
  isSubmitting,
}: StaffFormEditProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const form = useForm<UpdateStaffInput>({
    resolver: zodResolver(UpdateStaffSchema),
    defaultValues: {
      bio: defaultValues.bio,
      imageUrl: defaultValues.imageUrl ?? "",
      serviceIds: defaultValues.serviceIds,
    },
  })

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      form.setError("imageUrl", { message: "Please select an image file" })
      return
    }
    setIsUploading(true)
    form.clearErrors("imageUrl")
    try {
      const formData = new FormData()
      formData.set("file", file)
      formData.set("type", "staff")
      formData.set("staffId", staffId)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Upload failed")
      form.setValue("imageUrl", data.url)
    } catch (err) {
      form.setError("imageUrl", {
        message: err instanceof Error ? err.message : "Upload failed",
      })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  aria-label="Upload staff image"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Or paste image URL"
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
          name="serviceIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Services</FormLabel>
              <div className="space-y-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center space-x-2 space-y-0"
                  >
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={field.value?.includes(service.id) ?? false}
                      onCheckedChange={(checked) => {
                        const currentValue = field.value ?? []
                        const next =
                          checked === true
                            ? [...currentValue, service.id]
                            : currentValue.filter((id) => id !== service.id)
                        field.onChange(next)
                      }}
                    />
                    <label
                      htmlFor={`service-${service.id}`}
                      className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {service.name}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}

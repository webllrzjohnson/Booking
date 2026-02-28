"use client"

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
  defaultValues,
  services,
  onSubmit,
  isSubmitting,
}: StaffFormEditProps) {
  const form = useForm<UpdateStaffInput>({
    resolver: zodResolver(UpdateStaffSchema),
    defaultValues: {
      bio: defaultValues.bio,
      imageUrl: defaultValues.imageUrl ?? "",
      serviceIds: defaultValues.serviceIds,
    },
  })

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
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://..." />
              </FormControl>
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

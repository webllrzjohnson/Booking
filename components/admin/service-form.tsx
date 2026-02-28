"use client"

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
import { Textarea } from "@/components/ui/textarea"
import {
  CreateServiceSchema,
  UpdateServiceSchema,
  type CreateServiceInput,
  type UpdateServiceInput,
} from "@/lib/schemas/service"

type ServiceFormProps =
  | {
      mode: "create"
      defaultValues?: never
      onSubmit: (data: CreateServiceInput) => Promise<void>
      isSubmitting: boolean
    }
  | {
      mode: "edit"
      defaultValues: Partial<UpdateServiceInput> & { name: string; slug: string }
      onSubmit: (data: UpdateServiceInput) => Promise<void>
      isSubmitting: boolean
    }

export function ServiceForm(props: ServiceFormProps) {
  const schema = props.mode === "create" ? CreateServiceSchema : UpdateServiceSchema
  const defaultValues =
    props.mode === "create"
      ? {
          name: "",
          slug: "",
          description: "",
          durationMinutes: 60,
          price: 0,
        }
      : props.defaultValues

  const form = useForm<CreateServiceInput | UpdateServiceInput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as CreateServiceInput | UpdateServiceInput,
  })

  async function handleSubmit(data: CreateServiceInput | UpdateServiceInput) {
    await props.onSubmit(data as CreateServiceInput & UpdateServiceInput)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Massage Therapy" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="massage-therapy"
                  className="font-mono"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} placeholder="Service description..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="durationMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={props.isSubmitting}>
          {props.isSubmitting ? "Saving..." : props.mode === "create" ? "Create Service" : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}

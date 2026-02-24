"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, addMinutes } from "date-fns"
import { Clock, DollarSign, Calendar as CalendarIcon } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createBookingAction } from "@/lib/actions/create-booking"

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  notes: z.string().optional(),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface CustomerDetailsFormProps {
  service: {
    id: string
    name: string
    durationMinutes: number
    price: any
  }
  staff: {
    id: string
    name: string
  }
  startTime: Date
  user?: {
    id: string
    name?: string | null
    email?: string | null
    role: string
  } | null
}

export function CustomerDetailsForm({
  service,
  staff,
  startTime,
  user,
}: CustomerDetailsFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordField, setShowPasswordField] = useState(false)

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      notes: "",
      createAccount: false,
      password: "",
    },
  })

  const endTime = addMinutes(startTime, service.durationMinutes)

  async function onSubmit(data: BookingFormData) {
    setError(null)
    setIsLoading(true)

    try {
      const result = await createBookingAction({
        serviceId: service.id,
        staffId: staff.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes || null,
        createAccount: !user && data.createAccount,
        password: data.password || null,
      })

      if (result.success) {
        router.push(`/book/confirmation?booking=${result.data.bookingId}`)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {error && (
                  <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          disabled={!!user}
                        />
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
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          disabled={!!user}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(555) 123-4567"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requests or health information we should know..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!user && (
                  <>
                    <FormField
                      control={form.control}
                      name="createAccount"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked)
                                setShowPasswordField(checked === true)
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-normal cursor-pointer">
                              Create an account to manage your bookings
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {showPasswordField && (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Min 8 characters"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Confirming..." : "Confirm Booking"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Service</p>
                <p className="font-medium">{service.name}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600 mb-1">Practitioner</p>
                <p className="font-medium">{staff.name}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Date & Time
                </p>
                <p className="font-medium">
                  {format(startTime, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-600">
                  {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Duration
                </p>
                <p className="font-medium">{service.durationMinutes} minutes</p>
              </div>

              <Separator />

              <div className="pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${service.price.toString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

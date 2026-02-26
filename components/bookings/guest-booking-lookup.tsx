"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { Calendar, Clock, User, DollarSign } from "lucide-react"

const BUSINESS_TIMEZONE = "America/Toronto"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { lookupGuestBookingAction } from "@/lib/actions/guest-booking"

const lookupSchema = z.object({
  email: z.string().email("Invalid email address"),
  bookingRef: z.string().min(1, "Booking reference is required"),
})

type LookupFormData = z.infer<typeof lookupSchema>

export function GuestBookingLookup() {
  const [booking, setBooking] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LookupFormData>({
    resolver: zodResolver(lookupSchema),
    defaultValues: {
      email: "",
      bookingRef: "",
    },
  })

  async function onSubmit(data: LookupFormData) {
    setError(null)
    setBooking(null)
    setIsLoading(true)

    const result = await lookupGuestBookingAction(data.email, data.bookingRef)

    if (result.success) {
      setBooking(result.data)
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lookup Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookingRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Reference</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., ABC12345"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Searching..." : "Find Booking"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {booking && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>Your Appointment</CardTitle>
              <Badge
                variant={
                  booking.status === "CANCELLED" ? "destructive" : "default"
                }
              >
                {booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">
                    {format(toZonedTime(new Date(booking.startTime), BUSINESS_TIMEZONE), "EEEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(toZonedTime(new Date(booking.startTime), BUSINESS_TIMEZONE), "h:mm a")} -{" "}
                    {format(toZonedTime(new Date(booking.endTime), BUSINESS_TIMEZONE), "h:mm a")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Service & Practitioner</p>
                  <p className="font-medium">{booking.service.name}</p>
                  <p className="text-sm text-gray-600">
                    with {booking.staff.user.name}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-medium text-lg">
                    ${booking.service.price.toString()}
                  </p>
                </div>
              </div>
            </div>

            {booking.status !== "CANCELLED" && (
              <div className="pt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  To manage this booking, please{" "}
                  <a href="/signup" className="text-blue-600 hover:underline">
                    create an account
                  </a>{" "}
                  or{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    log in
                  </a>
                  .
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

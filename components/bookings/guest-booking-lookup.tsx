"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import { BookingLookupResults } from "@/components/bookings/booking-lookup-results"
import {
  lookupGuestBookingAction,
  type GuestBookingLookupResult,
} from "@/lib/actions/guest-booking"

const lookupSchema = z.object({
  email: z.string().email("Invalid email address"),
  bookingRef: z.string().min(1, "Booking reference is required"),
})

type LookupFormData = z.infer<typeof lookupSchema>

export function GuestBookingLookup() {
  const [result, setResult] =
    useState<GuestBookingLookupResult | null>(null)
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
    setResult(null)
    setIsLoading(true)

    const response = await lookupGuestBookingAction(data.email, data.bookingRef)

    if (response.success) {
      setResult(response.data)
    } else {
      setError(response.error)
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

      {result && <BookingLookupResults result={result} />}
    </div>
  )
}

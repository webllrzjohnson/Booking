"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { signupAction } from "@/lib/actions/auth"
import { COUNTRIES, CANADIAN_PROVINCES, US_STATES } from "@/lib/constants/address"
import { isValidCanadianPostalCode, isValidUSZipCode } from "@/lib/utils/postal"
import { isValidTelephone } from "@/lib/utils/telephone"
import { TelephoneInput } from "@/components/auth/telephone-input"

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    telephone: z.string().min(1, "Telephone is required"),
    streetAddress: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    country: z.enum(["Canada", "USA"], {
      required_error: "Please select a country",
    }),
    province: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    zipCode: z.string().optional(),
    password: z.string().trim().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.telephone && !isValidTelephone(data.telephone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Telephone must be in format (###)####-####",
        path: ["telephone"],
      })
    }
    if (data.country === "Canada") {
      if (!data.province?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Province is required",
          path: ["province"],
        })
      }
      if (!data.postalCode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Postal code is required",
          path: ["postalCode"],
        })
      } else if (!isValidCanadianPostalCode(data.postalCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Postal code must be in format A1A 1A1",
          path: ["postalCode"],
        })
      }
    }
    if (data.country === "USA") {
      if (!data.state?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "State is required",
          path: ["state"],
        })
      }
      if (!data.zipCode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ZIP code is required",
          path: ["zipCode"],
        })
      } else if (!isValidUSZipCode(data.zipCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ZIP code must be 12345 or 12345-6789",
          path: ["zipCode"],
        })
      }
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      telephone: "",
      streetAddress: "",
      city: "",
      country: undefined,
      province: "",
      state: "",
      postalCode: "",
      zipCode: "",
      password: "",
      confirmPassword: "",
    },
  })

  const country = form.watch("country")

  async function onSubmit(data: SignupFormData) {
    setError(null)
    setIsLoading(true)

    try {
      const result = await signupAction({
        name: data.name,
        email: data.email,
        phone: data.telephone,
        password: data.password,
        streetAddress: data.streetAddress,
        city: data.city,
        country: data.country,
        province: data.country === "Canada" ? data.province ?? null : null,
        state: data.country === "USA" ? data.state ?? null : null,
        postalCode: data.country === "Canada" ? data.postalCode ?? null : null,
        zipCode: data.country === "USA" ? data.zipCode ?? null : null,
      })

      if (result.success) {
        router.push("/verify-email?sent=1")
        router.refresh()
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Input placeholder="John Doe" {...field} />
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telephone</FormLabel>
              <FormControl>
                <TelephoneInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-label="Telephone number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-sm font-medium">Address</h3>

          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Toronto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={(v) => {
                    field.onChange(v)
                    form.setValue("province", "")
                    form.setValue("state", "")
                    form.setValue("postalCode", "")
                    form.setValue("zipCode", "")
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger aria-label="Country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {country === "Canada" && (
            <>
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger aria-label="Province">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CANADIAN_PROVINCES.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A1A 1A1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {country === "USA" && (
            <>
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger aria-label="State">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {US_STATES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="12345 or 12345-6789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  )
}

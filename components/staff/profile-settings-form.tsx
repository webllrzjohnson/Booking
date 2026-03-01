"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { UserCircle, Key, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChangePasswordSchema,
  UpdateProfileSchema,
  UpdateStaffProfileSchema,
  type ChangePasswordInput,
  type UpdateProfileInput,
  type UpdateStaffProfileInput,
} from "@/lib/schemas/profile"
import {
  changePasswordAction,
  updateProfileAction,
  updateStaffProfileAction,
} from "@/lib/actions/profile"

type ProfileSettingsFormProps = {
  profile: {
    name: string
    email: string
    phone: string
    streetAddress: string
    city: string
    country: string
    province: string
    state: string
    postalCode: string
    zipCode: string
  }
  staff: {
    id: string
    bio: string
    imageUrl: string
  }
}

export function ProfileSettingsForm({ profile, staff }: ProfileSettingsFormProps) {
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone || undefined,
      streetAddress: profile.streetAddress || undefined,
      city: profile.city || undefined,
      country: profile.country || undefined,
      province: profile.province || undefined,
      state: profile.state || undefined,
      postalCode: profile.postalCode || undefined,
      zipCode: profile.zipCode || undefined,
    },
  })

  const staffForm = useForm<UpdateStaffProfileInput>({
    resolver: zodResolver(UpdateStaffProfileSchema),
    defaultValues: {
      bio: staff.bio,
      imageUrl: staff.imageUrl || "",
    },
  })

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function handleProfileSubmit(data: UpdateProfileInput) {
    setProfileError(null)
    const profileResult = await updateProfileAction(data)
    if (!profileResult.success) {
      setProfileError(profileResult.error)
      return
    }
    const bio = staffForm.getValues("bio")
    const staffResult = await updateStaffProfileAction({ bio })
    if (!staffResult.success) {
      setProfileError(staffResult.error)
      return
    }
    profileForm.reset(data)
    staffForm.reset({ ...staffForm.getValues(), bio })
  }

  async function handleStaffSubmit(data: UpdateStaffProfileInput) {
    setAvatarError(null)
    const result = await updateStaffProfileAction(data)
    if (result.success) {
      staffForm.reset(data)
      toast.success("Avatar saved")
    } else {
      setAvatarError(result.error)
    }
  }

  async function handlePasswordSubmit(data: ChangePasswordInput) {
    setPasswordError(null)
    const result = await changePasswordAction(data)
    if (result.success) {
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } else {
      setPasswordError(result.error)
    }
  }

  const [isUploading, setIsUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      staffForm.setError("imageUrl", { message: "Please select an image file" })
      return
    }
    setIsUploading(true)
    staffForm.clearErrors("imageUrl")
    setAvatarError(null)
    try {
      const formData = new FormData()
      formData.set("file", file)
      formData.set("type", "staff")
      formData.set("staffId", staff.id)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Upload failed")
      staffForm.setValue("imageUrl", data.url)
      const result = await updateStaffProfileAction({ imageUrl: data.url })
      if (result.success) {
        toast.success("Avatar uploaded")
      } else {
        setAvatarError(result.error)
      }
    } catch (err) {
      staffForm.setError("imageUrl", {
        message: err instanceof Error ? err.message : "Upload failed",
      })
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger
          value="profile"
          className="flex flex-1 items-center justify-center gap-2"
        >
          <UserCircle className="h-4 w-4 shrink-0" />
          Profile
        </TabsTrigger>
        <TabsTrigger
          value="avatar"
          className="flex flex-1 items-center justify-center gap-2"
        >
          <ImageIcon className="h-4 w-4 shrink-0" />
          Avatar
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="flex flex-1 items-center justify-center gap-2"
        >
          <Key className="h-4 w-4 shrink-0" />
          Password
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your name, contact info, and bio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                className="space-y-4"
              >
                {profileError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {profileError}
                  </div>
                )}
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-sm text-muted-foreground">
                  Email: {profile.email} (cannot be changed)
                </div>
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+1 234 567 8900" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123 Main St" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="City" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Country" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province / State</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Province or State" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal / Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Postal or Zip" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={staffForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Brief professional bio..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={profileForm.formState.isSubmitting}
                >
                  {profileForm.formState.isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="avatar" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>
              Upload a profile image or paste an image URL.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...staffForm}>
              <form
                onSubmit={staffForm.handleSubmit(handleStaffSubmit)}
                className="space-y-4"
              >
                {avatarError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {avatarError}
                  </div>
                )}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={
                        staffForm.watch("imageUrl") || staff.imageUrl || undefined
                      }
                      alt="Profile"
                    />
                    <AvatarFallback className="text-2xl">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                      aria-label="Upload avatar"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                  </div>
                </div>
                <FormField
                  control={staffForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Or paste image URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://example.com/image.jpg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={staffForm.formState.isSubmitting}
                >
                  {staffForm.formState.isSubmitting ? "Saving..." : "Save Avatar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="password" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Enter your current password and choose a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-4"
              >
                {passwordError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {passwordError}
                  </div>
                )}
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting}
                >
                  {passwordForm.formState.isSubmitting
                    ? "Changing..."
                    : "Change Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

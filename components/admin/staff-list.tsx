"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StaffFormCreate } from "@/components/admin/staff-form"
import { createStaffAction } from "@/lib/actions/admin-staff"
import type { CreateStaffInput } from "@/lib/schemas/staff"

type StaffItem = {
  id: string
  name: string
  email: string
  bio: string
  services: string[]
}

type StaffListProps = {
  staff: StaffItem[]
}

export function StaffList({ staff }: StaffListProps) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Staff</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>Add Staff</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Staff</DialogTitle>
            </DialogHeader>
            <StaffFormCreate
              onSubmit={async (data: CreateStaffInput) => {
                setIsCreating(true)
                try {
                  const result = await createStaffAction(data)
                  if (result.success) {
                    setCreateOpen(false)
                    router.refresh()
                  } else {
                    throw new Error(result.error)
                  }
                } finally {
                  setIsCreating(false)
                }
              }}
              isSubmitting={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {staff.map((s) => (
          <Card key={s.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{s.name}</CardTitle>
              <Link href={`/dashboard/admin/staff/${s.id}`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{s.email}</p>
              {s.services.length > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  Services: {s.services.join(", ")}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

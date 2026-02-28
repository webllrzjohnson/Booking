"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ServiceForm } from "@/components/admin/service-form"
import {
  createServiceAction,
  updateServiceAction,
  deactivateServiceAction,
  activateServiceAction,
} from "@/lib/actions/admin-service"
import type { CreateServiceInput, UpdateServiceInput } from "@/lib/schemas/service"

type ServiceItem = {
  id: string
  name: string
  slug: string
  description: string
  durationMinutes: number
  price: number
  isActive: boolean
}

type ServiceListProps = {
  services: ServiceItem[]
}

export function ServiceList({ services }: ServiceListProps) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Services</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>Add Service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Service</DialogTitle>
            </DialogHeader>
            <ServiceForm
              mode="create"
              onSubmit={async (data) => {
                setIsCreating(true)
                try {
                  const result = await createServiceAction(data as CreateServiceInput)
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
        {services.map((service) => (
          <Card
            key={service.id}
            className={service.isActive ? "" : "opacity-60"}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{service.name}</CardTitle>
              <Badge variant={service.isActive ? "default" : "secondary"}>
                {service.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="font-mono">{service.slug}</span>
                <span>{service.durationMinutes} min</span>
                <span>${service.price.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={editOpen === service.id}
                  onOpenChange={(open) => setEditOpen(open ? service.id : null)}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Service</DialogTitle>
                    </DialogHeader>
                    <ServiceForm
                      mode="edit"
                      defaultValues={{
                        name: service.name,
                        slug: service.slug,
                        description: service.description,
                        durationMinutes: service.durationMinutes,
                        price: service.price,
                      }}
                      onSubmit={async (data) => {
                        setEditingId(service.id)
                        try {
                          const result = await updateServiceAction(
                            service.id,
                            data as UpdateServiceInput
                          )
                          if (result.success) {
                            setEditOpen(null)
                            router.refresh()
                          } else {
                            throw new Error(result.error)
                          }
                        } finally {
                          setEditingId(null)
                        }
                      }}
                      isSubmitting={editingId === service.id}
                    />
                  </DialogContent>
                </Dialog>
                {service.isActive ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deactivatingId !== null}
                    onClick={async () => {
                      setDeactivatingId(service.id)
                      try {
                        const result = await deactivateServiceAction(service.id)
                        if (result.success) {
                          router.refresh()
                        }
                      } finally {
                        setDeactivatingId(null)
                      }
                    }}
                  >
                    {deactivatingId === service.id ? "Deactivating..." : "Deactivate"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deactivatingId !== null}
                    onClick={async () => {
                      setDeactivatingId(service.id)
                      try {
                        const result = await activateServiceAction(service.id)
                        if (result.success) {
                          router.refresh()
                        }
                      } finally {
                        setDeactivatingId(null)
                      }
                    }}
                  >
                    {deactivatingId === service.id ? "Activating..." : "Activate"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

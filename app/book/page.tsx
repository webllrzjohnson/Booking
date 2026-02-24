import type { Metadata } from "next"
import Link from "next/link"

import { getServices } from "@/lib/queries/service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign } from "lucide-react"

export const metadata: Metadata = {
  title: "Book Appointment - Step 1: Choose Service - Fitness Health",
  description: "Select the service you'd like to book at Fitness Health.",
}

export default async function BookServicePage() {
  const services = await getServices()

  return (
    <div className="py-12 md:py-20">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600">Step 1 of 4: Choose a service</p>
        </div>

        <div className="grid gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="hover:border-blue-200 transition-colors"
            >
              <CardHeader>
                <CardTitle className="text-2xl">{service.name}</CardTitle>
                <CardDescription className="flex items-center gap-4 text-base">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {service.durationMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {service.price.toString()}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-end justify-between gap-4">
                <p className="text-gray-600 flex-1">{service.description}</p>
                <Link href={`/book/staff?service=${service.id}`}>
                  <Button>Select</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

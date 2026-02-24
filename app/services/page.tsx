import type { Metadata } from "next"

import { getServices } from "@/lib/queries/service"
import { ServiceCard } from "@/components/services/service-card"

export const metadata: Metadata = {
  title: "Our Services - Fitness Health",
  description:
    "Explore our range of professional services including physiotherapy, massage therapy, and acupuncture. View pricing and book your appointment today.",
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="py-12 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our range of professional treatments, each designed to
            support your health and wellness goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              name={service.name}
              slug={service.slug}
              description={service.description}
              durationMinutes={service.durationMinutes}
              price={Number(service.price)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

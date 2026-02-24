"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingCard } from "@/components/bookings/booking-card"

interface Booking {
  id: string
  serviceId: string
  staffId: string
  startTime: Date
  endTime: Date
  status: string
  notes: string | null
  service: {
    name: string
    price: any
  }
  staff: {
    id: string
    user: {
      name: string
    }
  }
}

interface BookingsListProps {
  upcoming: Booking[]
  past: Booking[]
}

export function BookingsList({ upcoming, past }: BookingsListProps) {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="upcoming">
          Upcoming ({upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="mt-6 space-y-4">
        {upcoming.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-600">No upcoming appointments</p>
          </div>
        ) : (
          upcoming.map((booking) => (
            <BookingCard key={booking.id} booking={booking} showActions />
          ))
        )}
      </TabsContent>

      <TabsContent value="past" className="mt-6 space-y-4">
        {past.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-600">No past appointments</p>
          </div>
        ) : (
          past.map((booking) => (
            <BookingCard key={booking.id} booking={booking} showActions={false} />
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}

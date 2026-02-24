import Link from "next/link"
import { User } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StaffMember {
  id: string
  name: string
  bio: string
  imageUrl: string | null
}

interface StaffSelectorProps {
  staff: StaffMember[]
  serviceId: string
}

export function StaffSelector({ staff, serviceId }: StaffSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {staff.map((member) => (
        <Card key={member.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={member.imageUrl || undefined} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{member.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-gray-600 text-sm mb-4 flex-1">{member.bio}</p>
            <Link
              href={`/book/datetime?service=${serviceId}&staff=${member.id}`}
              className="w-full"
            >
              <Button className="w-full">Select {member.name}</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

import Link from "next/link"
import { Clock, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ServiceCardProps {
  id: string
  name: string
  slug: string
  description: string
  durationMinutes: number
  price: number
}

export function ServiceCard({
  id,
  name,
  slug,
  description,
  durationMinutes,
  price,
}: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription className="flex items-center gap-4 text-base">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {durationMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            {price.toString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/book?service=${id}`} className="w-full">
          <Button className="w-full">Book This Service</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

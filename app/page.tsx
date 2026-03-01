import Link from "next/link"
import { ArrowRight, Users, Award, Heart } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSiteSettings } from "@/lib/queries/site-settings"
import { getAllStaff } from "@/lib/queries/staff"

export default async function HomePage() {
  const [settings, staff] = await Promise.all([
    getSiteSettings(),
    getAllStaff(),
  ])

  return (
    <div className="flex flex-col">
      <section
        className="relative text-white py-20 md:py-32 bg-primary"
        style={
          settings.heroImageUrl
            ? {
                backgroundImage: `linear-gradient(to bottom right, hsl(var(--primary) / 0.9), hsl(var(--primary) / 0.7)), url(${settings.heroImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Path to Better Health
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Experience professional physiotherapy, massage therapy, and
              acupuncture treatments in a calm, welcoming environment. Our
              experienced practitioners are here to help you heal and thrive.
            </p>
            <Link href="/book">
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg"
              >
                Book Your Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tailored treatments designed to address your unique needs and
              wellness goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Massage Therapy</CardTitle>
                <CardDescription className="text-base">
                  60 minutes • $80
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Therapeutic massage to relieve muscle tension, reduce stress,
                  and improve circulation.
                </p>
                <Link href="/services#massage">
                  <Button variant="link" className="p-0 h-auto">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Physiotherapy</CardTitle>
                <CardDescription className="text-base">
                  45 minutes • $120
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Evidence-based treatment for injury rehabilitation, pain
                  management, and movement optimization.
                </p>
                <Link href="/services#physiotherapy">
                  <Button variant="link" className="p-0 h-auto">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Acupuncture</CardTitle>
                <CardDescription className="text-base">
                  30 minutes • $90
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Traditional Chinese acupuncture to promote natural healing and
                  restore balance.
                </p>
                <Link href="/services#acupuncture">
                  <Button variant="link" className="p-0 h-auto">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {staff.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Practitioners
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet our experienced team dedicated to your wellness
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staff.map((practitioner) => (
                <Card
                  key={practitioner.id}
                  className="border-2 hover:border-primary/30 transition-colors overflow-hidden"
                >
                <CardHeader className="flex flex-row items-start gap-4">
                  <Avatar className="h-16 w-16 shrink-0">
                    {practitioner.imageUrl ? (
                      <AvatarImage
                        src={practitioner.imageUrl}
                        alt={practitioner.name}
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {practitioner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl">{practitioner.name}</CardTitle>
                    <CardDescription className="text-base">
                      {practitioner.services.length > 0
                        ? practitioner.services.join(", ")
                        : "General practitioner"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-4">
                    {practitioner.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Fitness Health
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Experienced Staff
              </h3>
              <p className="text-gray-600">
                Our certified practitioners have years of experience and
                ongoing training to provide the best care.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Modern Facilities
              </h3>
              <p className="text-gray-600">
                State-of-the-art equipment and comfortable treatment rooms
                designed for your wellness.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personalized Care
              </h3>
              <p className="text-gray-600">
                Every treatment plan is tailored to your individual needs and
                health goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Book your appointment today and take the first step toward better
            health and wellness.
          </p>
          <Link href="/book">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Book Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

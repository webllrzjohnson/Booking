import Link from "next/link"
import { ArrowRight, Users, Award, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Path to Better Health
            </h1>
            <p className="text-lg md:text-xl text-blue-50 mb-8 leading-relaxed">
              Experience professional physiotherapy, massage therapy, and
              acupuncture treatments in a calm, welcoming environment. Our
              experienced practitioners are here to help you heal and thrive.
            </p>
            <Link href="/book">
              <Button
                size="lg"
                className="bg-teal-500 hover:bg-teal-600 text-white shadow-lg"
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
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-blue-600" />
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

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-teal-600" />
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

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-teal-600" />
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

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Fitness Health
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
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
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-teal-600" />
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
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-teal-600" />
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

      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto">
            Book your appointment today and take the first step toward better
            health and wellness.
          </p>
          <Link href="/book">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
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

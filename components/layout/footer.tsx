import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

type FooterProps = {
  siteName?: string
  logoUrl?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  contactAddress?: string | null
}

export function Footer({
  siteName = "Fitness Health",
  logoUrl,
  contactPhone,
  contactEmail,
  contactAddress,
}: FooterProps) {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  {siteName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-xl font-semibold text-gray-900">
                {siteName}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Your trusted partner for physiotherapy, massage, and acupuncture
              treatments.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings/lookup"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Find My Booking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {contactPhone && (
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-secondary" />
                  <span>{contactPhone}</span>
                </li>
              )}
              {contactEmail && (
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-secondary" />
                  <span>{contactEmail}</span>
                </li>
              )}
              {contactAddress && (
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-secondary" />
                  <span>{contactAddress}</span>
                </li>
              )}
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-secondary" />
                <span>Mon-Fri: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                FH
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Fitness Health
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
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings/lookup"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Find My Booking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-teal-500" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-teal-500" />
                <span>info@fitnesshealth.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-teal-500" />
                <span>123 Wellness Street, Health City</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-teal-500" />
                <span>Mon-Fri: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Fitness Health. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

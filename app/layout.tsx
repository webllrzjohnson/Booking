import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { auth } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fitness Health - Physiotherapy, Massage & Acupuncture Clinic",
  description:
    "Book your appointment with Fitness Health. Professional physiotherapy, massage therapy, and acupuncture services to help you heal and feel your best.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header user={session?.user} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

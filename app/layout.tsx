import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Toaster } from "sonner"

import { auth } from "@/lib/auth"
import { getSiteSettings } from "@/lib/queries/site-settings"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { hexToHsl } from "@/lib/utils"

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
  const [session, settings] = await Promise.all([
    auth(),
    getSiteSettings(),
  ])

  const primaryHsl = hexToHsl(settings.primaryColor)
  const secondaryHsl = hexToHsl(settings.secondaryColor)

  return (
    <html lang="en">
      <body className={inter.className}>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--primary:${primaryHsl};--primary-foreground:210 40% 98%;--secondary:${secondaryHsl};--secondary-foreground:0 0% 100%;--ring:${primaryHsl}}`,
          }}
        />
        <div className="flex min-h-screen flex-col">
          <Header
            user={session?.user}
            siteName={settings.siteName}
            logoUrl={settings.logoUrl}
          />
          <main className="flex-1">{children}</main>
          <Footer
            siteName={settings.siteName}
            logoUrl={settings.logoUrl}
            contactPhone={settings.contactPhone}
            contactEmail={settings.contactEmail}
            contactAddress={settings.contactAddress}
          />
        </div>
        <Toaster />
      </body>
    </html>
  )
}

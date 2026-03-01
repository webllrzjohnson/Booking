"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  User,
  Settings,
  Shield,
  Palette,
  UserCircle,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { LogoutButton } from "@/components/auth/logout-button"

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  User,
  Settings,
  Shield,
  Palette,
  UserCircle,
}

interface NavItem {
  href: string
  label: string
  icon: string
  roles: string[]
}

interface DashboardSidebarProps {
  user: {
    name: string
    email: string
    role: string
  }
  navItems: NavItem[]
}

export function DashboardSidebar({ user, navItems }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="sticky top-20 space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="pt-4 border-t">
        <LogoutButton
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-700"
        />
      </div>
    </div>
  )
}

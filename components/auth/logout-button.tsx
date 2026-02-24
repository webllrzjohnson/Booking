"use client"

import { LogOut } from "lucide-react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/actions/auth"

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
}

export function LogoutButton({
  variant = "ghost",
  size = "sm",
  className,
  showIcon = true,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(() => {
      logoutAction()
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isPending}
      className={className}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {isPending ? "Logging out..." : "Log Out"}
    </Button>
  )
}

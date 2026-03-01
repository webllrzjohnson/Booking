"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { formatTelephoneInput } from "@/lib/utils/telephone"

export interface TelephoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string
  onChange?: (value: string) => void
}

const TelephoneInput = React.forwardRef<HTMLInputElement, TelephoneInputProps>(
  ({ className, value = "", onChange, onBlur, ...props }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value
      const formatted = formatTelephoneInput(raw)
      onChange?.(formatted)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      const allowed =
        /^\d$/.test(e.key) ||
        ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key) ||
        e.ctrlKey ||
        e.metaKey
      if (!allowed) {
        e.preventDefault()
      }
    }

    return (
      <input
        ref={ref}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="(416)1234-1234"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
TelephoneInput.displayName = "TelephoneInput"

export { TelephoneInput }

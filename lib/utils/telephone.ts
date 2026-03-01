const TELEPHONE_FORMAT = /^\(\d{3}\)\d{4}-\d{4}$/

export function formatTelephoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) {
    return digits.length > 0 ? `(${digits}` : ""
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 3)})${digits.slice(3)}`
  }
  return `(${digits.slice(0, 3)})${digits.slice(3, 7)}-${digits.slice(7)}`
}

export function isValidTelephone(value: string): boolean {
  return TELEPHONE_FORMAT.test(value)
}

export function cleanTelephone(value: string): string {
  return value.replace(/\D/g, "")
}

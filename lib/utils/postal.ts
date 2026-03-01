const CANADIAN_POSTAL_CODE = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
const US_ZIP_CODE = /^\d{5}(-\d{4})?$/

export function isValidCanadianPostalCode(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, " ")
  return CANADIAN_POSTAL_CODE.test(normalized)
}

export function isValidUSZipCode(value: string): boolean {
  return US_ZIP_CODE.test(value.trim())
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to Colombian locale
 */
export function formatDate(date: string | Date): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return "Fecha inválida"
    }

    return dateObj.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return "Fecha inválida"
  }
}

/**
 * Validate Colombian ID number (Cédula)
 */
export function validateColombianId(id: string): boolean {
  if (typeof id !== "string" || !/^\d{6,10}$/.test(id)) {
    return false
  }

  const digits = id.split("").map(Number)
  let sum = 0

  for (let i = 0; i < digits.length - 1; i++) {
    let product = digits[i] * (digits.length - i)
    if (product >= 10) {
      product = Math.floor(product / 10) + (product % 10)
    }
    sum += product
  }

  const checkDigit = (10 - (sum % 10)) % 10
  return checkDigit === digits[digits.length - 1]
}

/**
 * Format phone number for Colombian format
 */
export function formatPhoneNumber(phone: string): string {
  if (typeof phone !== "string") {
    return ""
  }

  const cleaned = phone.replace(/\D/g, "")

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }

  return phone
}

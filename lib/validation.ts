/**
 * Secure input validation and sanitization utilities
 */

// HTML sanitization (basic implementation - consider using DOMPurify for production)
export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") {
    return ""
  }

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

// Text sanitization for user inputs
export function sanitizeText(input: string): string {
  if (typeof input !== "string") {
    return ""
  }

  // Remove potentially dangerous characters
  return input
    .trim()
    .replace(/[<>'"]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
}

// Email validation
export function validateEmail(email: string): boolean {
  if (typeof email !== "string") {
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

// Colombian ID validation (enhanced security)
export function validateColombianId(id: string): boolean {
  if (typeof id !== "string") {
    return false
  }

  const sanitizedId = sanitizeText(id)

  if (!/^\d{6,10}$/.test(sanitizedId)) {
    return false
  }

  const digits = sanitizedId.split("").map(Number)
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

// Phone number validation
export function validatePhoneNumber(phone: string): boolean {
  if (typeof phone !== "string") {
    return false
  }

  const sanitizedPhone = sanitizeText(phone).replace(/\D/g, "")

  // Colombian phone numbers: 10 digits for mobile, 7 for landline
  return /^[0-9]{7,10}$/.test(sanitizedPhone)
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (typeof password !== "string") {
    return { isValid: false, errors: ["Contraseña inválida"] }
  }

  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("La contraseña debe contener al menos una letra minúscula")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("La contraseña debe contener al menos una letra mayúscula")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("La contraseña debe contener al menos un número")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("La contraseña debe contener al menos un carácter especial")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Generic form data validation
export function validateFormData(data: Record<string, unknown>): Record<string, string> {
  const sanitizedData: Record<string, string> = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitizedData[key] = sanitizeText(value)
    } else if (value !== null && value !== undefined) {
      sanitizedData[key] = sanitizeText(String(value))
    } else {
      sanitizedData[key] = ""
    }
  }

  return sanitizedData
}

// URL validation
export function validateUrl(url: string): boolean {
  if (typeof url !== "string") {
    return false
  }

  try {
    const urlObj = new URL(url)
    return ["http:", "https:"].includes(urlObj.protocol)
  } catch {
    return false
  }
}

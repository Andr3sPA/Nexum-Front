/**
 * Security utility functions for the application
 */

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input The user input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return ""

  // Convert to string if not already
  const str = String(input)

  // Replace potentially dangerous characters
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/`/g, "&#x60;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;")
    .trim()
}

/**
 * Validates an email address format
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
export function validateEmail(email: string): boolean {
  if (!email) return false

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a phone number format
 * @param phone Phone number to validate
 * @returns Boolean indicating if phone is valid
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false

  // Allow digits, spaces, dashes, plus, and parentheses
  // Minimum 7 digits, maximum 15 digits
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/

  // Count only digits
  const digitCount = phone.replace(/\D/g, "").length

  return phoneRegex.test(phone) && digitCount >= 7 && digitCount <= 15
}

/**
 * Validates a date is not in the future
 * @param date Date to validate
 * @returns Boolean indicating if date is valid
 */
export function validatePastDate(date: string): boolean {
  if (!date) return false

  const inputDate = new Date(date)
  const today = new Date()

  return inputDate <= today
}

/**
 * Validates a numeric input
 * @param value Value to validate
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @returns Boolean indicating if value is valid
 */
export function validateNumeric(value: string, min?: number, max?: number): boolean {
  if (!value) return false

  const num = Number(value)

  if (isNaN(num)) return false
  if (min !== undefined && num < min) return false
  if (max !== undefined && num > max) return false

  return true
}

/**
 * Escapes HTML content for safe display
 * @param html HTML content to escape
 * @returns Escaped HTML string
 */
export function escapeHtml(html: string): string {
  if (!html) return ""
  
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Secure logging utilities
 */

// Log levels
export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

// Secure logger that respects environment
export const logger = {
  error: (message: string, error?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.error(message, error)
    } else {
      // In production, log without sensitive details
      // You could also send to a secure logging service here
      console.error(sanitizeErrorMessage(message))
    }
  },
  
  warn: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(message, data)
    } else {
      console.warn(sanitizeErrorMessage(message))
    }
  },
  
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.info(message, data)
    }
    // Don't log info messages in production
  },
  
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(message, data)
    }
    // Don't log debug messages in production
  },
}

// Sanitize error messages to remove sensitive information
function sanitizeErrorMessage(message: string): string {
  // Remove potential sensitive data patterns (emails, tokens, etc.)
  return message
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL REDACTED]")
    .replace(/Bearer\s+[\w\.-]+/g, "Bearer [TOKEN REDACTED]")
    .replace(/password\s*[:=]\s*["']?[^"',;\s]+/gi, "password: [REDACTED]")
}
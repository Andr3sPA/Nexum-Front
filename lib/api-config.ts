/**
 *
 * 
 */

// Environment validation
import { logger } from "@/lib/logging"

const requiredEnvVars = ["NEXT_PUBLIC_API_BASE_URL"] as const

export function validateApiConfig(): boolean {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      if (process.env.NODE_ENV === "development") {
       
        
        

        logger.error(`Missing required environment variable: ${envVar}`)
      }
      return false
    }
  }
  return true
}

// API Configuration with security defaults
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.udea.edu.co",
  TIMEOUT: 30000, // 30 seconds
  ENVIRONMENT: process.env.NODE_ENV || "production",
} as const

// API Endpoints - centralized and type-safe
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY: "/auth/verify",
  },

  // Profile Management
  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    DELETE: "/profile",
  },

  // Graduate Management (Admin only)
  GRADUATES: {
    SEARCH: "/admin/graduates/search",
    CREATE: "/admin/graduates",
    UPDATE: "/admin/graduates",
    DELETE: "/admin/graduates",
  },

  // Reports (Admin/Dean only)
  REPORTS: {
    GENERATE: "/admin/reports",
    DOWNLOAD: "/admin/reports/download",
    LIST: "/admin/reports",
  },

  // Competencies (Dynamic data)
  COMPETENCIES: {
    BY_PROGRAM: "/competencies/program",
    LIST: "/competencies",
  },

  // Academic Programs
  PROGRAMS: {
    LIST: "/programs",
    GET: "/programs",
  },
} as const

// Default headers with security considerations
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  // Security headers
  "X-Requested-With": "XMLHttpRequest",
} as const

// HTTP Status Codes for better error handling
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

// Error codes for consistent error handling
export const ERROR_CODES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
} as const

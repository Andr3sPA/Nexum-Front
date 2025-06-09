import { API_CONFIG, API_ENDPOINTS, DEFAULT_HEADERS, validateApiConfig } from "./api-config"
import { getCsrfToken } from "./csrf-utils"
import { logger } from "./logging"
// Generic API error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Request timeout utility
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeoutMs)),
  ])
}

// Secure API client
class SecureApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor() {
    if (!validateApiConfig()) {
      throw new Error("Invalid API configuration")
    }

    this.baseUrl = API_CONFIG.BASE_URL
    this.defaultHeaders = { ...DEFAULT_HEADERS }
  }

  // Sanitize URL to prevent injection
  private sanitizeUrl(endpoint: string): string {
    // Remove any potentially dangerous characters
    const sanitized = endpoint.replace(/[<>'"]/g, "")

    // Ensure endpoint starts with /
    if (!sanitized.startsWith("/")) {
      return `/${sanitized}`
    }

    return sanitized
  }

  // Generic request method with security measures
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const sanitizedEndpoint = this.sanitizeUrl(endpoint)
    const url = `${this.baseUrl}${sanitizedEndpoint}`

    // Get CSRF token
    const csrfToken = getCsrfToken()

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
        // Add CSRF token header
        "X-CSRF-Token": csrfToken,
      },
      // Security headers
      credentials: "include", // Include cookies for authentication
      mode: "cors",
      cache: "no-cache",
    }

    try {
      const response = await withTimeout(fetch(url, config), API_CONFIG.TIMEOUT)

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = await this.getErrorMessage(response)
        throw new ApiError(errorMessage, response.status, response.statusText)
      }

      // Parse JSON response safely
      const data = await response.json()
      return data as T
    } catch (error) {
      // Log error for debugging (remove in production)
      
      
      
      
      if (API_CONFIG.ENVIRONMENT === "development") {
        logger.error("API Request failed:", error)
      }

      // Re-throw ApiError as-is
      if (error instanceof ApiError) {
        throw error
      }

      // Convert other errors to generic ApiError
      throw new ApiError("Se produjo un error de conexión. Por favor, inténtelo de nuevo.", 0, "NETWORK_ERROR")
    }
  }

  // Extract error message safely without exposing system details
  private async getErrorMessage(response: Response): Promise<string> {
    try {
      const errorData = await response.json()

      // Return user-friendly message if available
      if (errorData.message && typeof errorData.message === "string") {
        return errorData.message
      }

      if (errorData.error && typeof errorData.error === "string") {
        return errorData.error
      }
    } catch {
      // Failed to parse error response
    }

    // Return generic error messages based on status code
    switch (response.status) {
      case 400:
        return "Solicitud inválida. Por favor, verifique los datos ingresados."
      case 401:
        return "No autorizado. Por favor, inicie sesión nuevamente."
      case 403:
        return "No tiene permisos para realizar esta acción."
      case 404:
        return "El recurso solicitado no fue encontrado."
      case 429:
        return "Demasiadas solicitudes. Por favor, espere un momento."
      case 500:
        return "Error interno del servidor. Por favor, inténtelo más tarde."
      default:
        return "Se produjo un error inesperado. Por favor, inténtelo de nuevo."
    }
  }

  // HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

// Export singleton instance
export const apiClient = new SecureApiClient()

// Export API endpoints for use in components
export { API_ENDPOINTS }

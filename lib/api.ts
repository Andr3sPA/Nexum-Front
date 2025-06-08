/**
 * Secure API client for Universidad de Antioquia graduates platform
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.udea.edu.co"

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies for authentication
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw new Error("Error de conexión. Por favor, inténtelo de nuevo.")
    }
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: any) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  // Profile management
  async getProfile() {
    return this.request("/profile")
  }

  async updateProfile(data: any) {
    return this.request("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Competencies (for select multiple fields)
  async getCompetenciesByProgram(programId: string) {
    return this.request(`/competencies/program/${programId}`)
  }

  // Reports (for admin users)
  async generateReport(config: any) {
    return this.request("/admin/reports", {
      method: "POST",
      body: JSON.stringify(config),
    })
  }

  // Search graduates (for admin users)
  async searchGraduates(filters: any) {
    return this.request("/admin/graduates/search", {
      method: "POST",
      body: JSON.stringify(filters),
    })
  }
}

export const apiClient = new ApiClient()

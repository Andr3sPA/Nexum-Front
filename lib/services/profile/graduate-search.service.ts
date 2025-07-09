import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD } from "@/lib/services/constants/api.constants"

// Search filters interface
export interface GraduateSearchFilters {
  searchTerm?: string
  program?: string
  graduationYear?: string
  location?: string
  [key: string]: unknown
}

// Graduate search result interface
export interface GraduateSearchResult {
  id: string
  name: string
  lastname: string
  institutionalEmail: string
  program?: string
  graduationYear?: string
  location?: string
}

// Search response interface
export interface GraduateSearchResponse {
  graduates: GraduateSearchResult[]
  totalCount: number
  page: number
  pageSize: number
}

export const GraduateSearchService = {
  async searchGraduates(filters: GraduateSearchFilters): Promise<GraduateSearchResponse> {
    const { status, body } = await serviceWithAuth<GraduateSearchFilters, GraduateSearchResponse>(
      "/admin/graduates/search",
      METHOD.post,
      filters
    )
    
    if (status !== 200) {
      throw new Error((body as any)?.message || "Error al buscar graduados")
    }
    
    return body
  },

  async searchGraduatesMock(filters: GraduateSearchFilters): Promise<GraduateSearchResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock data
    const mockGraduates: GraduateSearchResult[] = [
      {
        id: "1",
        name: "Ana María",
        lastname: "Rodríguez",
        institutionalEmail: "ana.rodriguez@udea.edu.co",
        program: "Ingeniería de Sistemas",
        graduationYear: "2020",
        location: "Medellín",
      },
      {
        id: "2",
        name: "Carlos",
        lastname: "Gómez",
        institutionalEmail: "carlos.gomez@udea.edu.co",
        program: "Ingeniería de Sistemas",
        graduationYear: "2019",
        location: "Bogotá",
      },
      {
        id: "3",
        name: "Laura",
        lastname: "Martínez",
        institutionalEmail: "laura.martinez@udea.edu.co",
        program: "Ingeniería de Sistemas",
        graduationYear: "2021",
        location: "Medellín",
      },
      {
        id: "4",
        name: "Juan",
        lastname: "Pérez",
        institutionalEmail: "juan.perez@udea.edu.co",
        program: "Ingeniería Industrial",
        graduationYear: "2020",
        location: "Cali",
      },
      {
        id: "5",
        name: "María",
        lastname: "López",
        institutionalEmail: "maria.lopez@udea.edu.co",
        program: "Ingeniería Electrónica",
        graduationYear: "2021",
        location: "Medellín",
      },
    ]

    // Apply filters
    let filteredGraduates = [...mockGraduates]

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      filteredGraduates = filteredGraduates.filter(graduate => 
        graduate.name.toLowerCase().includes(searchTerm) ||
        graduate.lastname.toLowerCase().includes(searchTerm) ||
        graduate.institutionalEmail.toLowerCase().includes(searchTerm) ||
        graduate.id.includes(searchTerm)
      )
    }

    if (filters.program) {
      filteredGraduates = filteredGraduates.filter(graduate => 
        graduate.program?.toLowerCase().includes(filters.program!.toLowerCase())
      )
    }

    if (filters.graduationYear) {
      filteredGraduates = filteredGraduates.filter(graduate => 
        graduate.graduationYear === filters.graduationYear
      )
    }

    if (filters.location) {
      filteredGraduates = filteredGraduates.filter(graduate => 
        graduate.location?.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }

    return {
      graduates: filteredGraduates,
      totalCount: filteredGraduates.length,
      page: 1,
      pageSize: 10
    }
  }
} 
import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD, USER_ENDPOINT, API_HOST } from "@/lib/services/constants/api.constants"

// UserFilterRequest interface based on the API specification
export interface UserFilterRequest {
  // Personal Information
  identityDocument?: string
  identityDocumentTypeId?: number
  name?: string
  middleName?: string
  lastname?: string
  secondLastname?: string
  gender?: string
  birthdate?: string

  // Job Information
  companyName?: string
  jobCountry?: string
  position?: string
  relatedToProgram?: boolean
  salaryRangeId?: number
  jobDelayId?: number
  jobAreaId?: number
  institutionTypeId?: number

  // Innovation Process
  innovationTypeId?: number
  innovationName?: string

  // Coursed Program
  graduationYear?: number
  programId?: number

  // Contact Information
  address?: string
  country?: string
  city?: string
  mobile?: string
  email?: string
  academicEmail?: string
  whatsappAuthorization?: boolean

  // Auth
  role?: string

  // Academic Education
  studyType?: string
  studyName?: string
  academicInstitution?: string
  academicCountry?: string
}

// PageQuery interface for pagination
export interface PageQuery {
  sortBy?: string
  page?: number
  asc?: boolean
  pageSize?: number
}

// BasicUserResponse interface based on the API specification
export interface BasicUserResponse {
  id: string
  name: string
  middleName?: string
  lastname: string
  secondLastname?: string
  gender?: string
  programs?: BasicProgramResponse[]
  email?: string
  academicEmail?: string
  mobile?: string
  country?: string
  city?: string
  role?: string
}

// BasicProgramResponse interface
export interface BasicProgramResponse {
  name: string
  code?: string
}

// PageResponse interface for paginated results
export interface PageResponse<T> {
  page: number
  pageSize: number
  totalPages: number
  count: number
  totalCount: number
  content: T[]
}

// Search response interface
export interface GraduateSearchResponse {
  graduates: BasicUserResponse[]
  totalCount: number
  page: number
  pageSize: number
}

export const GraduateSearchService = {
  async searchGraduates(
    filterRequest: UserFilterRequest,
    pageQuery: PageQuery
  ): Promise<PageResponse<BasicUserResponse>> {
    // Construir query params
    const params = new URLSearchParams()
    
    // Filtros
    Object.entries(filterRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.append(key, String(value))
    })
    
    // Paginación
    Object.entries(pageQuery).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.append(key, String(value))
    })
    
    const endpoint = `${USER_ENDPOINT}/filter?${params.toString()}`
    const { status, body } = await serviceWithAuth<undefined, PageResponse<BasicUserResponse>>(
      endpoint,
      METHOD.get,
      undefined,
      API_HOST
    )
    if (status !== 200) {
      throw new Error((body as any)?.message || "Error al buscar graduados")
    }
    return body
  }
} 
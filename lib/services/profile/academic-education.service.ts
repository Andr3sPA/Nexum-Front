import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD } from "@/lib/services/constants/api.constants"

// Request interfaces
export interface AcademicEducationRequest {
  userId: string
  type: "COURSE" | "DIPLOMA" | "WORKSHOP" | "HACKATHON" | "OTHER"
  studyName: string
  institution: string
  country: string
}

// Response interfaces
export interface AcademicEducationUserResponse {
  id: string
  name: string
  lastname: string
}

export interface AcademicEducationResponse {
  id: number
  user: AcademicEducationUserResponse
  type: string
  studyName: string
  institution: string
  country: string
}

export const AcademicEducationService = {
  // Get all academic education
  async getAll(): Promise<AcademicEducationResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, AcademicEducationResponse[]>(
      `/v1/academic-education`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener la información académica")
    return body
  },

  // Get academic education by ID
  async getById(id: number): Promise<AcademicEducationResponse> {
    const { status, body } = await serviceWithAuth<undefined, AcademicEducationResponse>(
      `/v1/academic-education/${id}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener la información académica")
    return body
  },

  // Create new academic education
  async create(data: AcademicEducationRequest): Promise<AcademicEducationResponse> {
    const { status, body } = await serviceWithAuth<AcademicEducationRequest, AcademicEducationResponse>(
      `/v1/academic-education`,
      METHOD.post,
      data
    )
    if (status !== 201) throw new Error((body as any)?.message || "No se pudo crear la información académica")
    return body
  },

  // Update academic education by ID
  async updateById(id: number, data: AcademicEducationRequest): Promise<AcademicEducationResponse> {
    const { status, body } = await serviceWithAuth<AcademicEducationRequest, AcademicEducationResponse>(
      `/v1/academic-education/${id}`,
      METHOD.put,
      data
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo actualizar la información académica")
    return body
  },

  // Delete academic education by ID
  async deleteById(id: number): Promise<AcademicEducationResponse> {
    const { status, body } = await serviceWithAuth<undefined, AcademicEducationResponse>(
      `/v1/academic-education/${id}`,
      METHOD.delete
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo eliminar la información académica")
    return body
  }
} 
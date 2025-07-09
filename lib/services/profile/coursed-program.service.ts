import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD } from "@/lib/services/constants/api.constants"

// Request interfaces
export interface CoursedProgramRequest {
  userId: string
  programVersionId: number
  graduationYear: number
  strengths: string[]
  weaknesses: string[]
  improvementSuggestions: string[]
}

// Response interfaces
export interface CoursedProgramUserResponse {
  id: string
  name: string
  lastname: string
}

export interface CoursedProgramResponse {
  id: number
  user: CoursedProgramUserResponse
  programVersionId: number
  graduationYear: number
  strengths: string[]
  weaknesses: string[]
  improvementSuggestions: string[]
}

export const CoursedProgramService = {
  // Get all coursed programs
  async getAll(): Promise<CoursedProgramResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, CoursedProgramResponse[]>(
      `/v1/coursed-programs`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudieron obtener los programas cursados")
    return body
  },

  // Get coursed program by ID
  async getById(id: number): Promise<CoursedProgramResponse> {
    const { status, body } = await serviceWithAuth<undefined, CoursedProgramResponse>(
      `/v1/coursed-programs/${id}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener el programa cursado")
    return body
  },

  // Create new coursed program
  async create(data: CoursedProgramRequest): Promise<CoursedProgramResponse> {
    const { status, body } = await serviceWithAuth<CoursedProgramRequest, CoursedProgramResponse>(
      `/v1/coursed-programs`,
      METHOD.post,
      data
    )
    if (status !== 201) throw new Error((body as any)?.message || "No se pudo crear el programa cursado")
    return body
  },

  // Update coursed program by ID
  async updateById(id: number, data: CoursedProgramRequest): Promise<CoursedProgramResponse> {
    const { status, body } = await serviceWithAuth<CoursedProgramRequest, CoursedProgramResponse>(
      `/v1/coursed-programs/${id}`,
      METHOD.put,
      data
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo actualizar el programa cursado")
    return body
  },

  // Delete coursed program by ID
  async deleteById(id: number): Promise<CoursedProgramResponse> {
    const { status, body } = await serviceWithAuth<undefined, CoursedProgramResponse>(
      `/v1/coursed-programs/${id}`,
      METHOD.delete
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo eliminar el programa cursado")
    return body
  }
} 
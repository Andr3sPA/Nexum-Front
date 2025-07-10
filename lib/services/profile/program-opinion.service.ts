import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD } from "@/lib/services/constants/api.constants"

// Request interfaces
export interface ProgramOpinionRequest {
  coursedProgramId: number
  strengths: string
  weaknesses: string
  suggestedCompetencies: string[]
  whatsappGroupMember: boolean
}

// Response interfaces
export interface ProgramOpinionResponse {
  id: string
  identityDocument: string
  identityDocumentType: {
    id: number
    name: string
    abbreviation: string
  }
  name: string
  middleName: string
  lastname: string
  secondLastname: string
  birthdate: string
  creationDate: string
  lastUpdate: string
}

export const ProgramOpinionService = {
  // Get program opinion by ID
  async getById(id: number): Promise<ProgramOpinionResponse> {
    const { status, body } = await serviceWithAuth<undefined, ProgramOpinionResponse>(
      `/program-opinions/${id}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener la opinión del programa")
    return body
  },

  // Create new program opinion
  async create(data: ProgramOpinionRequest): Promise<ProgramOpinionResponse> {
    const { status, body } = await serviceWithAuth<ProgramOpinionRequest, ProgramOpinionResponse>(
      `/program-opinions`,
      METHOD.post,
      data
    )
    if (status !== 201) throw new Error((body as any)?.message || "No se pudo crear la opinión del programa")
    return body
  },

  // Update program opinion by ID
  async updateById(id: number, data: ProgramOpinionRequest): Promise<ProgramOpinionResponse> {
    const { status, body } = await serviceWithAuth<ProgramOpinionRequest, ProgramOpinionResponse>(
      `/program-opinions/${id}`,
      METHOD.put,
      data
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo actualizar la opinión del programa")
    return body
  }
} 
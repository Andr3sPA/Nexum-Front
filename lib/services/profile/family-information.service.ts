import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD } from "@/lib/services/constants/api.constants"

// Request interfaces
export interface FamilyInformationRequest {
  userId: string
  maritalState: "MARRIED" | "DIVORCED" | "SINGLE" | "FREE_UNION"
  childNumber: number
}

// Response interfaces
export interface FamilyInformationUserResponse {
  id: string
  name: string
  lastname: string
}

export interface FamilyInformationResponse {
  id: number
  user: FamilyInformationUserResponse
  maritalState: "MARRIED" | "DIVORCED" | "SINGLE" | "FREE_UNION"
  childNumber: number
  creationDate: string
  lastUpdate: string
}

export const FamilyInformationService = {
  // Get family information by ID
  async getById(id: number): Promise<FamilyInformationResponse> {
    const { status, body } = await serviceWithAuth<undefined, FamilyInformationResponse>(
      `/v1/family-information/${id}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener la información familiar")
    return body
  },

  // Create new family information
  async create(data: FamilyInformationRequest): Promise<FamilyInformationResponse> {
    const { status, body } = await serviceWithAuth<FamilyInformationRequest, FamilyInformationResponse>(
      `/v1/family-information`,
      METHOD.post,
      data
    )
    if (status !== 201) throw new Error((body as any)?.message || "No se pudo crear la información familiar")
    return body
  },

  // Update family information by ID
  async updateById(id: number, data: FamilyInformationRequest): Promise<FamilyInformationResponse> {
    const { status, body } = await serviceWithAuth<FamilyInformationRequest, FamilyInformationResponse>(
      `/v1/family-information/${id}`,
      METHOD.put,
      data
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo actualizar la información familiar")
    return body
  }
} 
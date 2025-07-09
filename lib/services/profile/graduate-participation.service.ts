import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD } from "@/lib/services/constants/api.constants"

// Request interfaces
export interface GraduateParticipationRequest {
  userId: string
  innovationProcessTypeIds: number[]
  continuousEducationInterests: string[]
  willingToBeSpeaker: boolean
  willingToBeProfessor: boolean
  willingToTeachNonFormalEducation: boolean
  willingToBePostgraduateStudent: boolean
  willingToBeNonFormalStudent: boolean
  willingToBeGraduateRepresentative: boolean
  willingToAttendAlumniMeetings: boolean
  willingToParticipateInAlumniActivities: boolean
}

// Response interfaces
export interface GraduateParticipationUserResponse {
  id: string
  fullName: string
  email: string
}

export interface InnovationProcessTypeResponse {
  id: number
  name: string
  description: string
}

export interface GraduateParticipationResponse {
  id: number
  user: GraduateParticipationUserResponse
  participatedInnovationProcesses: InnovationProcessTypeResponse[]
  continuousEducationInterests: string[]
  willingToBeSpeaker: boolean
  willingToBeProfessor: boolean
  willingToTeachNonFormalEducation: boolean
  willingToBePostgraduateStudent: boolean
  willingToBeNonFormalStudent: boolean
  willingToBeGraduateRepresentative: boolean
  willingToAttendAlumniMeetings: boolean
  willingToParticipateInAlumniActivities: boolean
  creationDate: string
  lastUpdate: string
}

export const GraduateParticipationService = {
  // Get all graduate participations
  async getAll(): Promise<GraduateParticipationResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, GraduateParticipationResponse[]>(
      `/v1/graduate-participation`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudieron obtener las participaciones")
    return body
  },

  // Get graduate participation by ID
  async getById(id: number): Promise<GraduateParticipationResponse> {
    const { status, body } = await serviceWithAuth<undefined, GraduateParticipationResponse>(
      `/v1/graduate-participation/${id}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener la participación")
    return body
  },

  // Get graduate participations by user ID
  async getByUserId(userId: string): Promise<GraduateParticipationResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, GraduateParticipationResponse[]>(
      `/v1/graduate-participation/user?userId=${userId}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudieron obtener las participaciones del usuario")
    return body
  },

  // Create new graduate participation
  async create(data: GraduateParticipationRequest): Promise<GraduateParticipationResponse> {
    const { status, body } = await serviceWithAuth<GraduateParticipationRequest, GraduateParticipationResponse>(
      `/v1/graduate-participation`,
      METHOD.post,
      data
    )
    if (status !== 201) throw new Error((body as any)?.message || "No se pudo crear la participación")
    return body
  },

  // Update graduate participation by ID
  async updateById(id: number, data: GraduateParticipationRequest): Promise<GraduateParticipationResponse> {
    const { status, body } = await serviceWithAuth<GraduateParticipationRequest, GraduateParticipationResponse>(
      `/v1/graduate-participation/${id}`,
      METHOD.put,
      data
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo actualizar la participación")
    return body
  },

  // Delete graduate participation by ID
  async deleteById(id: number): Promise<GraduateParticipationResponse> {
    const { status, body } = await serviceWithAuth<undefined, GraduateParticipationResponse>(
      `/v1/graduate-participation/${id}`,
      METHOD.delete
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo eliminar la participación")
    return body
  }
} 
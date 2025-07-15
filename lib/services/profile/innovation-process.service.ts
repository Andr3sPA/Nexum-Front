import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD } from "@/lib/services/constants/api.constants"


// Request interfaces
export interface InnovationProcessRequest {
  userId: string
  typeId: number
  name: string
  description?: string
  link?: string
}

export interface InnovationProcessTypeResponse {
    id: number
    name: string
    description: string
  }
  

// Response interfaces
export interface InnovationProcessUserResponse {
  id: string
  name: string
  lastName: string
}

export interface InnovationProcessResponse {
  id: number
  user: InnovationProcessUserResponse
  type: InnovationProcessTypeResponse
  name: string
  description?: string
  link?: string
  creationDate: string
  lastUpdate: string
}

export const InnovationProcessService = {
  // Get all innovation processes
  async getAll(): Promise<InnovationProcessResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, InnovationProcessResponse[]>(
      `/innovation-processes`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudieron obtener los procesos de innovación")
    return body
  },

  // Get innovation process by ID
  async getById(id: number): Promise<InnovationProcessResponse> {
    const { status, body } = await serviceWithAuth<undefined, InnovationProcessResponse>(
      `/innovation-processes/${id}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener el proceso de innovación")
    return body
  },

  // Get innovation processes by user ID
  async getByUserId(userId: string): Promise<InnovationProcessResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, InnovationProcessResponse[]>(
      `/innovation-processes/user?userId=${userId}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudieron obtener los procesos de innovación del usuario")
    return body
  },

  // Create new innovation process
  async create(data: InnovationProcessRequest): Promise<InnovationProcessResponse> {
    const { status, body } = await serviceWithAuth<InnovationProcessRequest, InnovationProcessResponse>(
      `/innovation-processes`,
      METHOD.post,
      data
    )
    if (status !== 201) throw new Error((body as any)?.message || "No se pudo crear el proceso de innovación")
    return body
  },

  // Update innovation process by ID
  async updateById(id: number, data: InnovationProcessRequest): Promise<InnovationProcessResponse> {
    const { status, body } = await serviceWithAuth<InnovationProcessRequest, InnovationProcessResponse>(
      `/innovation-processes/${id}`,
      METHOD.put,
      data
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo actualizar el proceso de innovación")
    return body
  },

  // Delete innovation process by ID
  async deleteById(id: number): Promise<InnovationProcessResponse> {
    const { status, body } = await serviceWithAuth<undefined, InnovationProcessResponse>(
      `/innovation-processes/${id}`,
      METHOD.delete
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo eliminar el proceso de innovación")
    return body
  }
} 
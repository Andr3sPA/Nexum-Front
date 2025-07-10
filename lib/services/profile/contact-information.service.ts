import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD } from "@/lib/services/constants/api.constants"

// Request interfaces
export interface ContactInformationRequest {
  userId: string
  address: string
  country: string
  state: string
  city: string
  landline: string
  mobile: string
  email: string
  academicEmail: string
  whatsappAuthorization: boolean
  isCurrent: boolean
}

// Response interfaces
export interface ContactInformationUserResponse {
  id: string
  name: string
  lastname: string
}

export interface ContactInformationResponse {
  id: number
  user: ContactInformationUserResponse
  address: string
  country: string
  state: string
  city: string
  landline: string
  mobile: string
  email: string
  academicEmail: string
  whatsappAuthorization: boolean
  isCurrent: boolean
  creationDate: string
  lastUpdate: string
}

export const ContactInformationService = {
  // Get contact information by ID
  async getById(id: number): Promise<ContactInformationResponse> {
    const { status, body } = await serviceWithAuth<undefined, ContactInformationResponse>(
      `/contact-information/${id}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener la información de contacto")
    return body
  },

  // Get current contact information by user ID
  async getCurrentByUserId(userId: string): Promise<ContactInformationResponse> {
    const { status, body } = await serviceWithAuth<undefined, ContactInformationResponse>(
      `/contact-information/current?userId=${userId}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener la información de contacto actual")
    return body
  },

  // Create new contact information
  async create(data: ContactInformationRequest): Promise<ContactInformationResponse> {
    const { status, body } = await serviceWithAuth<ContactInformationRequest, ContactInformationResponse>(
      `/contact-information`,
      METHOD.post,
      data
    )
    if (status !== 201) throw new Error((body as any)?.message || "No se pudo crear la información de contacto")
    return body
  },

  // Update contact information by ID
  async updateById(id: number, data: ContactInformationRequest): Promise<ContactInformationResponse> {
    const { status, body } = await serviceWithAuth<ContactInformationRequest, ContactInformationResponse>(
      `/contact-information/${id}`,
      METHOD.put,
      data
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo actualizar la información de contacto")
    return body
  }
} 
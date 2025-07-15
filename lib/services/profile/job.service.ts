import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD } from "@/lib/services/constants/api.constants"

// Request interfaces
export interface JobRequest {
  userId: string
  companyName: string
  country: string
  position: string
  relatedToProgram: boolean
  salaryRangeId: number
  jobDelayId: number
  jobAreaId: number
  institutionTypeId: number
  firstJob: boolean
  currentJob: boolean
}

// Response interfaces
export interface JobUserResponse {
  id: string
  name: string
  lastname: string
}

export interface JobSalaryRangeResponse {
  id: number
  salary: string
}

export interface JobDelayResponse {
  id: number
  label: string
}

export interface JobAreaResponse {
  id: number
  name: string
}

export interface JobInstitutionTypeResponse {
  id: number
  name: string
}

export interface JobResponse {
  id: number
  user: JobUserResponse
  companyName: string
  country: string
  position: string
  relatedToProgram: boolean
  salaryRange: JobSalaryRangeResponse
  jobDelay: JobDelayResponse
  jobArea: JobAreaResponse
  institutionType: JobInstitutionTypeResponse
  firstJob: boolean
  currentJob: boolean
  creationDate: string
  lastUpdate: string
}

export const JobService = {
  // Get all jobs
  async getAll(): Promise<JobResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, JobResponse[]>(
      `/job`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudieron obtener los trabajos")
    return body
  },

  // Get job by ID
  async getById(id: number): Promise<JobResponse> {
    const { status, body } = await serviceWithAuth<undefined, JobResponse>(
      `/job/${id}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener el trabajo")
    return body
  },

  // Get jobs by user ID
  async getByUserId(userId: string): Promise<JobResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, JobResponse[]>(
      `/job/user?userId=${userId}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudieron obtener los trabajos del usuario")
    return body
  },

  // Create new job
  async create(data: JobRequest): Promise<JobResponse> {
    console.log("🏢 JobService.create called with data:", data)
    try {
      const { status, body } = await serviceWithAuth<JobRequest, JobResponse>(
        `/job`,
        METHOD.post,
        data
      )
      console.log("✅ JobService.create result:", { status, body })
      if (status !== 201) throw new Error((body as any)?.message || "No se pudo crear el trabajo")
      return body
    } catch (error) {
      console.error("❌ JobService.create error:", error)
      throw error
    }
  },

  // Update job by ID
  async updateById(id: number, data: JobRequest): Promise<JobResponse> {
    const { status, body } = await serviceWithAuth<JobRequest, JobResponse>(
      `/job/${id}`,
      METHOD.put,
      data
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo actualizar el trabajo")
    return body
  },

  // Delete job by ID
  async deleteById(id: number): Promise<JobResponse> {
    const { status, body } = await serviceWithAuth<undefined, JobResponse>(
      `/job/${id}`,
      METHOD.delete
    )
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo eliminar el trabajo")
    return body
  }
} 
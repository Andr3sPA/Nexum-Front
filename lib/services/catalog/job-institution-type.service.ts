import {
  CATALOG_JOB_INSTITUTION_TYPE_ENDPOINT,
  METHOD,
  CATALOG_HOST
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

// Request interfaces
export interface JobInstitutionTypeRequest {
  name: string;
  description?: string;
  programId: number;
}

// Response interfaces
export interface JobInstitutionTypeResponse {
  id: number;
  name: string;
  description: string;
}

export const JobInstitutionTypeService = {
  // Get all job institution types
  async getAll(): Promise<JobInstitutionTypeResponse[]> {
    const { body } = await serviceWithAuth(
      CATALOG_JOB_INSTITUTION_TYPE_ENDPOINT,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get job institution types by enabled status
  async getAllByEnabled(enabled: boolean): Promise<JobInstitutionTypeResponse[]> {
    const { body } = await serviceWithAuth(
      `${CATALOG_JOB_INSTITUTION_TYPE_ENDPOINT}/enabled?enabled=${enabled}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get job institution types by program ID
  async getAllByProgramId(programId: number): Promise<JobInstitutionTypeResponse[]> {
    const { body } = await serviceWithAuth(
      `${CATALOG_JOB_INSTITUTION_TYPE_ENDPOINT}/program?programId=${programId}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get job institution type by ID
  async getById(id: number): Promise<JobInstitutionTypeResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_JOB_INSTITUTION_TYPE_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Create new job institution type
  async create(data: JobInstitutionTypeRequest): Promise<JobInstitutionTypeResponse> {
    const { body } = await serviceWithAuth(
      CATALOG_JOB_INSTITUTION_TYPE_ENDPOINT,
      METHOD.post,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Update job institution type by ID
  async updateById(id: number, data: JobInstitutionTypeRequest): Promise<JobInstitutionTypeResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_JOB_INSTITUTION_TYPE_ENDPOINT}/${id}`,
      METHOD.put,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Delete job institution type by ID
  async deleteById(id: number): Promise<JobInstitutionTypeResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_JOB_INSTITUTION_TYPE_ENDPOINT}/${id}`,
      METHOD.delete,
      undefined,
      CATALOG_HOST
    );
    return body;
  }
}; 

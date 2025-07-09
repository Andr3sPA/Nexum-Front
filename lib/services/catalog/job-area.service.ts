import { 
  CATALOG_JOB_AREA_ENDPOINT, 
  METHOD,
  CATALOG_HOST 
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

// Request interfaces
export interface JobAreaRequest {
  name: string;
  description?: string;
  programId: number;
}

// Response interfaces
export interface JobAreaResponse {
  id: number;
  name: string;
  description: string;
}

export const JobAreaService = {
  // Get all job areas
  async getAll(): Promise<JobAreaResponse[]> {
    const { body } = await serviceWithAuth(
      CATALOG_JOB_AREA_ENDPOINT,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get job areas by enabled status
  async getAllByEnabled(enabled: boolean): Promise<JobAreaResponse[]> {
    const { body } = await serviceWithAuth(
      `${CATALOG_JOB_AREA_ENDPOINT}/enabled?enabled=${enabled}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get job area by ID
  async getById(id: number): Promise<JobAreaResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_JOB_AREA_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Create new job area
  async create(data: JobAreaRequest): Promise<JobAreaResponse> {
    const { body } = await serviceWithAuth(
      CATALOG_JOB_AREA_ENDPOINT,
      METHOD.post,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Update job area by ID
  async updateById(id: number, data: JobAreaRequest): Promise<JobAreaResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_JOB_AREA_ENDPOINT}/${id}`,
      METHOD.put,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Delete job area by ID
  async deleteById(id: number): Promise<JobAreaResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_JOB_AREA_ENDPOINT}/${id}`,
      METHOD.delete,
      undefined,
      CATALOG_HOST
    );
    return body;
  }
}; 
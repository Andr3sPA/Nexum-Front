import { 
  CATALOG_SALARY_RANGE_ENDPOINT, 
  METHOD,
  CATALOG_HOST 
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

// Request interfaces
export interface SalaryRangeRequest {
  min: number;
  max: number;
  currency: string;
  order?: number;
  active: boolean;
}

// Response interfaces
export interface SalaryRangeResponse {
  id: number;
  salary: string;
  order: number;
  active: boolean;
  creationDate: string;
  lastUpdate: string;
}

export const SalaryRangeService = {
  // Get all salary ranges
  async getAll(): Promise<SalaryRangeResponse[]> {
    const { body } = await serviceWithAuth(
      CATALOG_SALARY_RANGE_ENDPOINT,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get salary range by ID
  async getById(id: number): Promise<SalaryRangeResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_SALARY_RANGE_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Create new salary range
  async create(data: SalaryRangeRequest): Promise<SalaryRangeResponse> {
    const { body } = await serviceWithAuth(
      CATALOG_SALARY_RANGE_ENDPOINT,
      METHOD.post,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Update salary range by ID
  async updateById(id: number, data: SalaryRangeRequest): Promise<SalaryRangeResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_SALARY_RANGE_ENDPOINT}/${id}`,
      METHOD.put,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Delete salary range by ID
  async deleteById(id: number): Promise<SalaryRangeResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_SALARY_RANGE_ENDPOINT}/${id}`,
      METHOD.delete,
      undefined,
      CATALOG_HOST
    );
    return body;
  }
}; 
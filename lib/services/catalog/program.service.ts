import { 
  CATALOG_PROGRAM_ENDPOINT, 
  METHOD,
  CATALOG_HOST 
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

// Request interfaces
export interface ProgramRequest {
  name: string;
  code: string;
}

// Response interfaces
export interface ProgramResponse {
  id: number;
  name: string;
  code: string;
}

export const ProgramService = {
  // Get all programs
  async getAll(): Promise<ProgramResponse[]> {
    const { body } = await serviceWithAuth(
      CATALOG_PROGRAM_ENDPOINT,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get program by ID
  async getById(id: number): Promise<ProgramResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Create new program
  async create(data: ProgramRequest): Promise<ProgramResponse> {
    const { body } = await serviceWithAuth(
      CATALOG_PROGRAM_ENDPOINT,
      METHOD.post,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Update program by ID
  async updateById(id: number, data: ProgramRequest): Promise<ProgramResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_ENDPOINT}/${id}`,
      METHOD.put,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Delete program by ID
  async deleteById(id: number): Promise<ProgramResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_ENDPOINT}/${id}`,
      METHOD.delete,
      undefined,
      CATALOG_HOST
    );
    return body;
  }
}; 
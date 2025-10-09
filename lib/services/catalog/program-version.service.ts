import {
  CATALOG_PROGRAM_VERSION_ENDPOINT,
  METHOD,
  CATALOG_HOST
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

// Request interfaces
export interface ProgramVersionRequest {
  programId: number;
  version: number;
  startYear: number;
  endYear?: number;
}

// Response interfaces
export interface ProgramVersionResponse {
  id: number;
  program: {
    id: number;
    name: string;
    code: string;
  };
  version: number;
  startYear: number;
  endYear: number;
}

export const ProgramVersionService = {
  // Get all program versions
  async getAll(): Promise<ProgramVersionResponse[]> {
    const { body } = await serviceWithAuth(
      CATALOG_PROGRAM_VERSION_ENDPOINT,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get program versions by program ID
  async getAllByProgramId(programId: number): Promise<ProgramVersionResponse[]> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_VERSION_ENDPOINT}/program?programId=${programId}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get program version by ID
  async getById(id: number): Promise<ProgramVersionResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_VERSION_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Create new program version
  async create(data: ProgramVersionRequest): Promise<ProgramVersionResponse> {
    const { body } = await serviceWithAuth(
      CATALOG_PROGRAM_VERSION_ENDPOINT,
      METHOD.post,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Update program version by ID
  async updateById(id: number, data: ProgramVersionRequest): Promise<ProgramVersionResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_VERSION_ENDPOINT}/${id}`,
      METHOD.put,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Delete program version by ID
  async deleteById(id: number): Promise<ProgramVersionResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_VERSION_ENDPOINT}/${id}`,
      METHOD.delete,
      undefined,
      CATALOG_HOST
    );
    return body;
  }
}; 

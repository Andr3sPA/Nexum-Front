import {
  CATALOG_PROGRAM_COMPETENCY_ENDPOINT,
  METHOD,
  CATALOG_HOST
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

// Request interfaces
export interface ProgramCompetencyRequest {
  name: string;
  description?: string;
  programId: number;
}

// Response interfaces
export interface ProgramCompetencyResponse {
  id: number;
  name: string;
  description: string;
}

export const ProgramCompetencyService = {
  // Get all program competencies
  async getAll(): Promise<ProgramCompetencyResponse[]> {
    const { body } = await serviceWithAuth(
      CATALOG_PROGRAM_COMPETENCY_ENDPOINT,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get program competencies by program ID
  async getAllByProgramId(programId: number): Promise<ProgramCompetencyResponse[]> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_COMPETENCY_ENDPOINT}/program?programId=${programId}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get program competency by ID
  async getById(id: number): Promise<ProgramCompetencyResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_COMPETENCY_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Create new program competency
  async create(data: ProgramCompetencyRequest): Promise<ProgramCompetencyResponse> {
    const { body } = await serviceWithAuth(
      CATALOG_PROGRAM_COMPETENCY_ENDPOINT,
      METHOD.post,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Update program competency by ID
  async updateById(id: number, data: ProgramCompetencyRequest): Promise<ProgramCompetencyResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_COMPETENCY_ENDPOINT}/${id}`,
      METHOD.put,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Delete program competency by ID
  async deleteById(id: number): Promise<ProgramCompetencyResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_PROGRAM_COMPETENCY_ENDPOINT}/${id}`,
      METHOD.delete,
      undefined,
      CATALOG_HOST
    );
    return body;
  }
}; 

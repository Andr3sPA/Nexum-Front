import { 
  CATALOG_INNOVATION_PROCESS_TYPE_ENDPOINT, 
  METHOD,
  CATALOG_HOST 
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

// Request interfaces
export interface InnovationProcessTypeRequest {
  name: string;
  description?: string;
  enabled: boolean;
}

// Response interfaces
export interface InnovationProcessTypeResponse {
  id: number;
  name: string;
  description: string;
}

export const InnovationProcessTypeService = {
  // Get all innovation process types
  async getAll(): Promise<InnovationProcessTypeResponse[]> {
    const { body } = await serviceWithAuth(
      CATALOG_INNOVATION_PROCESS_TYPE_ENDPOINT,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get innovation process types by enabled status
  async getAllByEnabled(enabled: boolean): Promise<InnovationProcessTypeResponse[]> {
    const { body } = await serviceWithAuth(
      `${CATALOG_INNOVATION_PROCESS_TYPE_ENDPOINT}/enabled?enabled=${enabled}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get innovation process types by IDs
  async getAllByIds(ids: number[]): Promise<InnovationProcessTypeResponse[]> {
    const idsParam = ids.join(',');
    const { body } = await serviceWithAuth(
      `${CATALOG_INNOVATION_PROCESS_TYPE_ENDPOINT}/ids?ids=${idsParam}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get innovation process type by ID
  async getById(id: number): Promise<InnovationProcessTypeResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_INNOVATION_PROCESS_TYPE_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Create new innovation process type
  async create(data: InnovationProcessTypeRequest): Promise<InnovationProcessTypeResponse> {
    const { body } = await serviceWithAuth(
      CATALOG_INNOVATION_PROCESS_TYPE_ENDPOINT,
      METHOD.post,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Update innovation process type by ID
  async updateById(id: number, data: InnovationProcessTypeRequest): Promise<InnovationProcessTypeResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_INNOVATION_PROCESS_TYPE_ENDPOINT}/${id}`,
      METHOD.put,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Delete innovation process type by ID
  async deleteById(id: number): Promise<InnovationProcessTypeResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_INNOVATION_PROCESS_TYPE_ENDPOINT}/${id}`,
      METHOD.delete,
      undefined,
      CATALOG_HOST
    );
    return body;
  }
}; 
import { 
  CATALOG_ALTERNATIVE_ACADEMIC_ROUTE_ENDPOINT, 
  METHOD,
  CATALOG_HOST 
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

// Request interfaces
export interface AlternativeAcademicRouteRequest {
  name: string;
  description?: string;
  enabled: boolean;
}

// Response interfaces
export interface AlternativeAcademicRouteResponse {
  id: number;
  name: string;
  description: string;
}

export const AlternativeAcademicRouteService = {
  // Get all alternative academic routes
  async getAll(): Promise<AlternativeAcademicRouteResponse[]> {
    const { body } = await serviceWithAuth(
      CATALOG_ALTERNATIVE_ACADEMIC_ROUTE_ENDPOINT,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get alternative academic routes by enabled status
  async getAllByEnabled(enabled: boolean): Promise<AlternativeAcademicRouteResponse[]> {
    const { body } = await serviceWithAuth(
      `${CATALOG_ALTERNATIVE_ACADEMIC_ROUTE_ENDPOINT}/enabled?enabled=${enabled}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get alternative academic route by ID
  async getById(id: number): Promise<AlternativeAcademicRouteResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_ALTERNATIVE_ACADEMIC_ROUTE_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Create new alternative academic route
  async create(data: AlternativeAcademicRouteRequest): Promise<AlternativeAcademicRouteResponse> {
    const { body } = await serviceWithAuth(
      CATALOG_ALTERNATIVE_ACADEMIC_ROUTE_ENDPOINT,
      METHOD.post,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Update alternative academic route by ID
  async updateById(id: number, data: AlternativeAcademicRouteRequest): Promise<AlternativeAcademicRouteResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_ALTERNATIVE_ACADEMIC_ROUTE_ENDPOINT}/${id}`,
      METHOD.put,
      data,
      CATALOG_HOST
    );
    return body;
  },

  // Delete alternative academic route by ID
  async deleteById(id: number): Promise<AlternativeAcademicRouteResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_ALTERNATIVE_ACADEMIC_ROUTE_ENDPOINT}/${id}`,
      METHOD.delete,
      undefined,
      CATALOG_HOST
    );
    return body;
  }
}; 
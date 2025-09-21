import { 
  OPPORTUNITY_ENDPOINT, 
  METHOD,
  OPPORTUNITY_HOST 
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

// Request DTO for creating an opportunity
export interface OpportunityRequest {
  title: string;
  description: string;
  location?: string;
  employmentType?: string;
  salaryRangeId?: number; // id of salary range (optional)
  graduateId?: string; // UUID (optional, if targeting a graduate)
}

// Response DTO for opportunity
export interface OpportunityResponse {
  id: number;
  title: string;
  description: string;
  location?: string;
  employmentType?: string;
  status?: string;
  creationDate?: string;
  lastUpdate?: string;
  graduateId?: string;
  salaryRange?: {
    id: number;
    name: string;
    minValue?: number;
    maxValue?: number;
  };
}

export const OpportunityService = {
  // Registrar una nueva oportunidad (POST)
  async create(data: OpportunityRequest): Promise<OpportunityResponse> {
    const { body } = await serviceWithAuth<OpportunityRequest, OpportunityResponse>(
      OPPORTUNITY_ENDPOINT,
      METHOD.post,
      data,
      OPPORTUNITY_HOST
    );
    return body;
  },

  // Obtener todas las oportunidades (GET)
  async list(): Promise<OpportunityResponse[]> {
    const { body } = await serviceWithAuth<undefined, OpportunityResponse[]>(
      OPPORTUNITY_ENDPOINT,
      METHOD.get,
      undefined,
      OPPORTUNITY_HOST
    );
    return body;
  },

  // Obtener oportunidad por id (GET)
  async getById(id: number): Promise<OpportunityResponse> {
    const { body } = await serviceWithAuth<undefined, OpportunityResponse>(
      `${OPPORTUNITY_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      OPPORTUNITY_HOST
    );
    return body;
  },
};
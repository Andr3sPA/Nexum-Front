import { 
  OPPORTUNITY_ENDPOINT, 
  METHOD,
  OPPORTUNITY_HOST 
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

export type OpportunityStatus = "Draft" | "Active" | "Closed" | "Expired" | "On Hold" | "Cancelled";

export type ContractType =
  | "Full Time"
  | "Part Time"
  | "Contract"
  | "Temporary"
  | "Internship"
  | "Freelance";

export type RequiredExperience =
  | "No experience required"
  | "Less than 1 year"
  | "1-2 years"
  | "2-4 years"
  | "4-6 years"
  | "More than 6 years"
  | "Not specified";

export type WorkModality = "Remote" | "On Site" | "Hybrid";

// Request DTO for creating an opportunity
export interface OpportunityRequest {
    title: string;
    description: string;
    location: string;
    status: OpportunityStatus;
    creationDate: string;
    lastUpdate: string;
    graduateId: string;
    salaryRange: {
        min: number;
        max: number;
        currency: string;
    };
    contractType: ContractType;
    startDate: string;
    durationInMonths: number;
    complementaryStudies: string;
    requiredExperience: RequiredExperience;
    travelAvailability: boolean;
    workModality: WorkModality;
}

// Response DTO for opportunity
export interface OpportunityResponse {
    id: number;
    title: string;
    description: string;
    location: string;
    status: OpportunityStatus;
    creationDate: string;
    lastUpdate: string;
    graduateId: string;
    salaryRange: {
        min: number;
        max: number;
        currency: string;
    };
    contractType: ContractType;
    startDate: string;
    durationInMonths: number | null;
    complementaryStudies?: string;
    requiredExperience: RequiredExperience;
    travelAvailability?: boolean;
    workModality: WorkModality;
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

  // Actualizar oportunidad (PUT)
  async update(id: number, data: OpportunityRequest): Promise<OpportunityResponse> {
    const { body } = await serviceWithAuth<OpportunityRequest, OpportunityResponse>(
      `${OPPORTUNITY_ENDPOINT}/${id}`,
      METHOD.put,
      data,
      OPPORTUNITY_HOST
    );
    return body;
  },
};
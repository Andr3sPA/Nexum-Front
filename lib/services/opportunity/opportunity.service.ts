import {
  OPPORTUNITY_ENDPOINT,
  METHOD,
  OPPORTUNITY_HOST
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth, service } from "@/lib/services/base.service";

export type OpportunityStatus = "Draft" | "Active" | "Closed" | "Expired" | "On Hold" | "Cancelled";

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
  salaryRangeId: number;

  // Business information
  businessName?: string;
  contactName?: string;
  businessEmail?: string;
  businessPhone?: string;

  // Edit code for anonymous editing
  editCode?: string;

  complementaryStudies: string;
  requiredExperience: RequiredExperience;
  travelAvailability: boolean;
  workModality: WorkModality;
  expirationDate: string;

  // Multiple selections
  coursedProgramIds: number[];
  programCompetencyIds: number[];
  jobAreaIds: number[];
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
  salaryRangeId: number;

  // Business information
  businessName?: string;
  contactName?: string;
  businessEmail?: string;
  businessPhone?: string;

  // Edit code for anonymous editing
  editCode?: string;

  complementaryStudies?: string;
  requiredExperience: RequiredExperience;
  travelAvailability?: boolean;
  workModality: WorkModality;
  expirationDate: string;

  // Multiple selections
  coursedProgramIds: number[];
  programCompetencyIds: number[];
  jobAreaIds: number[];
}

export const OpportunityService = {
  // Registrar una nueva oportunidad (POST) - permite usuarios anónimos
  async create(data: OpportunityRequest): Promise<OpportunityResponse> {
    const { status, body } = await serviceWithAuth<OpportunityRequest, OpportunityResponse>(
      OPPORTUNITY_ENDPOINT,
      METHOD.post,
      data,
      OPPORTUNITY_HOST
    );
    if (status !== 201) {
      throw new Error((body as any)?.message || `Error creating opportunity: HTTP ${status}`);
    }
    return body;
  },

  // Obtener todas las oportunidades (GET) - con autenticación
  async list(): Promise<OpportunityResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, OpportunityResponse[]>(
      OPPORTUNITY_ENDPOINT,
      METHOD.get,
      undefined,
      OPPORTUNITY_HOST
    );
    if (status !== 200) {
      throw new Error((body as any)?.message || `Error listing opportunities: HTTP ${status}`);
    }
    return body;
  },

  // Obtener todas las oportunidades de forma pública (GET) - sin autenticación requerida
  async listPublic(): Promise<OpportunityResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, OpportunityResponse[]>(
      OPPORTUNITY_ENDPOINT,
      METHOD.get,
      undefined,
      OPPORTUNITY_HOST
    );
    if (status !== 200) {
      throw new Error((body as any)?.message || `Error listing public opportunities: HTTP ${status}`);
    }
    return body;
  },

  // Obtener oportunidad por id (GET)
  async getById(id: number): Promise<OpportunityResponse> {
    const { status, body } = await serviceWithAuth<undefined, OpportunityResponse>(
      `${OPPORTUNITY_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      OPPORTUNITY_HOST
    );
    if (status !== 200) {
      throw new Error((body as any)?.message || `Error getting opportunity by id: HTTP ${status}`);
    }
    return body;
  },

  // Actualizar oportunidad (PUT)
  async update(id: number, data: OpportunityRequest): Promise<OpportunityResponse> {
    const { status, body } = await serviceWithAuth<OpportunityRequest, OpportunityResponse>(
      `${OPPORTUNITY_ENDPOINT}/${id}`,
      METHOD.put,
      data,
      OPPORTUNITY_HOST
    );
    if (status !== 200) {
      throw new Error((body as any)?.message || `Error updating opportunity: HTTP ${status}`);
    }
    return body;
  },
};

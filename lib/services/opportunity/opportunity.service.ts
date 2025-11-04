import {
  OPPORTUNITY_ENDPOINT,
  METHOD,
  OPPORTUNITY_HOST
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth, service } from "@/lib/services/base.service";

export type OpportunityStatus = "DRAFT" | "ACTIVE" | "CLOSED" | "EXPIRED" | "ON_HOLD" | "CANCELLED";

export type RequiredExperience =
  | "No experience required"
  | "Less than 1 year"
  | "1-2 years"
  | "2-4 years"
  | "4-6 years"
  | "More than 6 years"
  | "Not specified";

export type WorkModality = "REMOTE" | "ON_SITE" | "HYBRID";

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
  // Optional external link where candidates can apply or get more info
  link?: string;

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
  // Optional external link where candidates can apply or get more info
  link?: string;

  // Edit code for anonymous editing
  editCode?: string;

  complementaryStudies?: string;
  requiredExperience: RequiredExperience;
  travelAvailability?: boolean;
  workModality: WorkModality;
  expirationDate: string;

  // Arrays of names instead of IDs
  coursedPrograms: string[];
  programCompetencies: string[];
  jobAreas: string[];

  // Nested objects
  businessContact?: {
    id: number;
    businessName: string;
    contactName: string;
    businessEmail: string;
    businessPhone: string;
    creationDate: string;
    lastUpdate: string;
  };

  candidateRequirements?: {
    id: number;
    complementaryStudies: string;
    requiredExperience: RequiredExperience;
    location: string;
    travelAvailability: boolean;
    workModality: WorkModality;
    creationDate: string;
    lastUpdate: string;
  };
}

// Candidate profile from backend
export interface OpportunityCandidate {
  id: string; // UUID
  name: string;
  middleName?: string;
  lastname: string;
  secondLastname?: string;
  email?: string;
  mobile?: string;
  country?: string;
  city?: string;
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
    const { status, body } = await service<undefined, OpportunityResponse[]>(
      OPPORTUNITY_ENDPOINT,
      METHOD.get,
      undefined,
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

  // Obtener oportunidad por id (GET) sin autenticación - útil para vistas públicas
  async getPublicById(id: number): Promise<OpportunityResponse> {
    const { status, body } = await service<undefined, OpportunityResponse>(
      `${OPPORTUNITY_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      undefined,
      OPPORTUNITY_HOST
    );
    if (status !== 200) {
      throw new Error((body as any)?.message || `Error getting public opportunity by id: HTTP ${status}`);
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

  // Actualizar SOLO el estado de la oportunidad (PATCH) - solo ADMIN
  async updateStatus(id: number, statusParam: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EXPIRED' | 'ON_HOLD' | 'CANCELLED'): Promise<OpportunityResponse> {
    const endpoint = `${OPPORTUNITY_ENDPOINT}/${id}/status?status=${encodeURIComponent(statusParam)}`;
    const { status, body } = await serviceWithAuth<undefined, OpportunityResponse>(
      endpoint,
      METHOD.patch,
      undefined,
      OPPORTUNITY_HOST
    );
    if (status !== 200) {
      throw new Error((body as any)?.message || `Error updating opportunity status: HTTP ${status}`);
    }
    return body;
  },

  // Buscar candidatos para una oportunidad (paginado, 5 por página)
  async searchCandidates(opportunityId: number, query: string = "", page: number = 0): Promise<OpportunityCandidate[]> {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    params.append("page", String(page));
    
    const endpoint = `${OPPORTUNITY_ENDPOINT}/${opportunityId}/candidates?${params.toString()}`;
    console.log('[searchCandidates] Calling endpoint:', endpoint);
    console.log('[searchCandidates] Full URL:', `${OPPORTUNITY_HOST}${endpoint}`);
    
    const { status, body } = await serviceWithAuth<undefined, OpportunityCandidate[]>(
      endpoint,
      METHOD.get,
      undefined,
      OPPORTUNITY_HOST
    );
    
    console.log('[searchCandidates] Response status:', status);
    console.log('[searchCandidates] Response body:', body);
    
    if (status !== 200) {
      throw new Error((body as any)?.message || `Error searching candidates: HTTP ${status}`);
    }
    return body;
  },

  // Obtener lista de IDs de candidatos contratados
  async getHiredCandidates(opportunityId: number): Promise<string[]> {
    const endpoint = `${OPPORTUNITY_ENDPOINT}/${opportunityId}/hired`;
    const { status, body } = await serviceWithAuth<undefined, string[]>(
      endpoint,
      METHOD.get,
      undefined,
      OPPORTUNITY_HOST
    );
    if (status !== 200) {
      throw new Error((body as any)?.message || `Error getting hired candidates: HTTP ${status}`);
    }
    return body;
  },

  // Guardar lista de candidatos contratados (reemplaza la lista completa)
  async saveHiredCandidates(opportunityId: number, candidateIds: string[]): Promise<void> {
    const endpoint = `${OPPORTUNITY_ENDPOINT}/${opportunityId}/hired`;
    const { status, body } = await serviceWithAuth<string[], void>(
      endpoint,
      METHOD.post,
      candidateIds,
      OPPORTUNITY_HOST
    );
    if (status !== 200) {
      throw new Error((body as any)?.message || `Error saving hired candidates: HTTP ${status}`);
    }
  },
};

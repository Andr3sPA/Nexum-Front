import { OPPORTUNITY_HOST } from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

export interface ApplicationRequest {
  opportunityId: number;
}

export interface ApplicationResponse {
  id: string;
  userId: string;
  opportunity: any; // Puedes tipar mejor si tienes el tipo OpportunityResponse
  createdDate: string;
  lastUpdate: string;
  status: string;
}

export const ApplicationService = {
  async apply(data: ApplicationRequest): Promise<ApplicationResponse> {
    const { body } = await serviceWithAuth<ApplicationRequest, ApplicationResponse>(
      "/application",
      "POST",
      data,
      OPPORTUNITY_HOST
    );
    return body;
  },

  async list(): Promise<ApplicationResponse[]> {
    const { body } = await serviceWithAuth<undefined, ApplicationResponse[]>(
      "/application",
      "GET",
      undefined,
      OPPORTUNITY_HOST
    );
    return body;
  },
};

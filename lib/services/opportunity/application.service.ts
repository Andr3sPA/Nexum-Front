import { OPPORTUNITY_HOST, METHOD } from "@/lib/services/constants/api.constants";
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

export interface ApplicationMetricsResponse {
  totalApplications: number
  applicationsLast6Months: number
  applicationsLast12Months: number
}

export interface ApplicationTimelineResponse {
  timeline: Array<{ date: string; count: number }>
  startDate: string
  endDate: string
  months: number
}

export const ApplicationService = {
  async apply(data: ApplicationRequest): Promise<ApplicationResponse> {
    console.log('ApplicationService.apply called with data:', data);
    const { body } = await serviceWithAuth<ApplicationRequest, ApplicationResponse>(
      "/application",
      "POST",
      data,
      OPPORTUNITY_HOST
    );
    console.log('ApplicationService.apply response:', body);
    return body;
  },

  async list(): Promise<ApplicationResponse[]> {
    const { body } = await serviceWithAuth<undefined, ApplicationResponse[]>(
      "/applications",
      "GET",
      undefined,
      OPPORTUNITY_HOST
    );
    return body;
  },

  async getApplicationMetrics(): Promise<ApplicationMetricsResponse> {
    const endpoint = `/application/metrics`
    try {
      const { status, body } = await serviceWithAuth<undefined, ApplicationMetricsResponse>(
        endpoint,
        METHOD.get,
        undefined,
        OPPORTUNITY_HOST
      )

      if (status !== 200) {
        const serverMessage = (body as any)?.message || JSON.stringify(body)
        const err = new Error(`HTTP ${status} - ${serverMessage}`)
        ;(err as any).status = status
        ;(err as any).body = body
        throw err
      }
      return body
    } catch (error) {
      throw error
    }
  },

  async getApplicationTimeline(months: number = 12): Promise<ApplicationTimelineResponse> {
    const endpoint = `/application/metrics/timeline?months=${months}`
    try {
      const { status, body } = await serviceWithAuth<undefined, ApplicationTimelineResponse>(
        endpoint,
        METHOD.get,
        undefined,
        OPPORTUNITY_HOST
      )

      if (status !== 200) {
        const serverMessage = (body as any)?.message || JSON.stringify(body)
        const err = new Error(`HTTP ${status} - ${serverMessage}`)
        ;(err as any).status = status
        ;(err as any).body = body
        throw err
      }
      return body
    } catch (error) {
      throw error
    }
  },
};

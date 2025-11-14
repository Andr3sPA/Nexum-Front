import { serviceWithAuth } from "@/lib/services/base.service"
import { METHOD, PROFILE_HOST } from "@/lib/services/constants/api.constants"

export interface MetricsProgramCount {
  programVersionId?: number | null
  count: number
}

export interface MetricsResponse {
  totalUsers: number
  usersByRole: Record<string, number>
  totalGraduates: number
  graduatesByProgramVersion: MetricsProgramCount[]
  currentJobsCount: number
  relatedToProgramJobsCount: number
  graduateParticipationCount: number
  innovationProcessCount: number
  programOpinionCount: number
}

export const MetricsService = {
  async getMetrics(): Promise<MetricsResponse> {
    const endpoint = `/metrics`
    try {
      const { status, body } = await serviceWithAuth<undefined, MetricsResponse>(
        endpoint,
        METHOD.get,
        undefined,
        PROFILE_HOST
      )

      if (status !== 200) {
        // Preferir mensaje del body si existe
        const serverMessage = (body as any)?.message || JSON.stringify(body)
        const err = new Error(`HTTP ${status} - ${serverMessage}`)
        ;(err as any).status = status
        ;(err as any).body = body
        throw err
      }
      return body
    } catch (error) {
      // Re-lanzar para que la UI pueda manejar códigos específicos
      throw error
    }
  }
}

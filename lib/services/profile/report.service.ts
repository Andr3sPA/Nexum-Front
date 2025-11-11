import { serviceWithAuth, serviceWithAuthRawBinary } from "@/lib/services/base.service"
import { METHOD, PROFILE_HOST } from "@/lib/services/constants/api.constants"

export type ReportFormat = "PDF" | "HTML" | "XLSX"

export interface ReportFilterRequest {
  gender?: string
  country?: string
  state?: string
  city?: string
  address?: string
  startYear?: number
  endYear?: number
  programId?: number
}

export interface ReportUserResponse {
  names: string
  lastnames: string
  email: string
  mobile: string
  graduateGender: string
  program: string
  occupation: string
  identityDocument: string
  graduationYear: number
}

export interface GraduateReportResponse {
  users: ReportUserResponse[]
  program: string
  gender: string
  country: string
  state: string
  city: string
  totalGraduates: number
  womanCount: number
  manCount: number
  nonBinaryCount: number
  otherCount: number
  womanPercentage: number
  manPercentage: number
  nonBinaryPercentage: number
  otherPercentage: number
  startYear: number
  endYear: number
}

export interface ProgramEmployability {
  programName: string
  totalGraduates: number
  employedGraduates: number
  employabilityRate: number
}

export interface EducationEmployabilityResponse {
  totalGraduates: number
  employedGraduates: number
  employabilityRate: number
  byProgram: ProgramEmployability[]
}

export const ReportService = {
  async generateGraduateReport(
    filterRequest: ReportFilterRequest,
    format: ReportFormat = "PDF"
  ): Promise<void> {
    const params = new URLSearchParams()
    Object.entries(filterRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.append(key, String(value))
    })
    params.append("format", format)
    const endpoint = `/reports/graduates?${params.toString()}`
    const { status, body } = await serviceWithAuthRawBinary<undefined>(
      endpoint,
      METHOD.get,
      undefined,
      PROFILE_HOST
    )
    if (status !== 200) {
      throw new Error("No se pudo generar el reporte")
    }
    
    try {
      // El body ahora es un ArrayBuffer directamente
      const arrayBuffer = body as ArrayBuffer
      
      // Determinar el tipo MIME basado en el formato
      const mimeType = format === "PDF" 
        ? "application/pdf" 
        : format === "HTML" 
          ? "text/html" 
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      
      const blob = new Blob([arrayBuffer], { type: mimeType })
      
      // Intentar descarga automática
      const url = window.URL.createObjectURL(blob)
      const ext = format === "PDF" ? "pdf" : format === "XLSX" ? "xlsx" : "html"
      const filename = `reporte-egresados.${ext}`
      
      // Método 1: Descarga automática con elemento <a>
      try {
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.style.display = "none"
        document.body.appendChild(a)
        
        // Pequeño delay para asegurar que el elemento esté listo
        await new Promise(resolve => setTimeout(resolve, 100))
        
        a.click()
        
        // Limpiar después de un pequeño delay
        setTimeout(() => {
          if (document.body.contains(a)) {
            document.body.removeChild(a)
          }
          window.URL.revokeObjectURL(url)
        }, 100)
        
      } catch (downloadError) {
        // Método 2: Fallback con window.open
        const newWindow = window.open(url, '_blank')
        if (newWindow) {
          // logger.info("File opened in new window")
        } else {
          // Método 3: Último recurso - mostrar URL para descarga manual
          // logger.info("Download URL:", url)
          alert(`No se pudo descargar automáticamente. Por favor, copia esta URL y ábrela en una nueva pestaña: ${url}`)
        }
      }
    } catch (error) {
      // logger.error("Error during download:", error)
      // logger.error("Error details:", {
      //   message: error instanceof Error ? error.message : String(error),
      //   stack: error instanceof Error ? error.stack : undefined,
      //   bodyType: typeof body,
      //   bodySize: body instanceof ArrayBuffer ? body.byteLength : 'N/A'
      // })
      throw new Error(`Error al procesar la descarga del archivo: ${error instanceof Error ? error.message : String(error)}`)
    }
  },

  async getGraduateReportSummary(
    filterRequest: ReportFilterRequest
  ): Promise<GraduateReportResponse> {
    // logger.info("📡 Llamando a getGraduateReportSummary con filtros:", filterRequest)

    const params = new URLSearchParams()
    Object.entries(filterRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.append(key, String(value))
    })
    const endpoint = `/reports/graduates/summary?${params.toString()}`

    // logger.info("🔗 Endpoint:", endpoint)
    // logger.info("📋 Parámetros:", params.toString())

    const { status, body } = await serviceWithAuth<undefined, GraduateReportResponse>(
      endpoint,
      METHOD.get,
      undefined,
      PROFILE_HOST
    )

    // logger.info("📊 Status de respuesta:", status)
    // logger.info("📄 Body de respuesta:", body)

    if (status !== 200) {
      throw new Error("No se pudo obtener el resumen del reporte")
    }
    return body
  },

  async getEducationEmployability(): Promise<EducationEmployabilityResponse> {
    const endpoint = `/reports/education-employability`

    const { status, body } = await serviceWithAuth<undefined, EducationEmployabilityResponse>(
      endpoint,
      METHOD.get,
      undefined,
      PROFILE_HOST
    )

    if (status !== 200) {
      throw new Error("No se pudo obtener el reporte de empleabilidad educativa")
    }
    return body
  }
} 
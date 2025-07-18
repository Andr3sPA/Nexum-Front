"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { ROLES } from "@/lib/services/constants/api.constants"
import { ReportService, ReportFormat, GraduateReportResponse } from "@/lib/services/profile/report.service"
import { useAcademic } from "@/contexts/academic-context"
import { ReportTemplate } from "@/components/templates/report-template"
import { ReportContainer } from "@/components/organisms/report-container"

export default function ReportsPage() {
  const router = useRouter()
  const { programs, isLoadingPrograms } = useAcademic()
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
  const user = LocalStorageService.getItem<any>("user")
  const email = user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")
  
  const [reportConfig, setReportConfig] = useState({
    gender: "",
    country: "",
    state: "",
    city: "",
    address: "",
    startYear: "",
    endYear: "",
    programId: "",
  })

  const [reportData, setReportData] = useState<GraduateReportResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  React.useEffect(() => {
    if (user && user.role && user.role !== ROLES.ADMINISTRATIVE && user.role !== ROLES.DEAN) {
      router.replace("/dashboard")
    }
  }, [user, router])

  const handleConfigChange = (field: string, value: string) => {
    setReportConfig((prev) => ({ ...prev, [field]: value }))
  }

  const generateReport = async () => {
    console.log("🚀 Iniciando generación de reporte...")
    console.log("📊 Filtros configurados:", reportConfig)
    
    setIsGenerating(true)
    try {
      // Prepara los filtros para el servicio
      const filters = {
        gender: reportConfig.gender || undefined,
        country: reportConfig.country || undefined,
        state: reportConfig.state || undefined,
        city: reportConfig.city || undefined,
        address: reportConfig.address || undefined,
        startYear: reportConfig.startYear ? Number(reportConfig.startYear) : undefined,
        endYear: reportConfig.endYear ? Number(reportConfig.endYear) : undefined,
        programId: reportConfig.programId ? Number(reportConfig.programId) : undefined,
      }
      
      console.log("🔍 Filtros procesados para API:", filters)
      
      const summaryData = await ReportService.getGraduateReportSummary(filters)
      console.log("✅ Datos recibidos de la API:", summaryData)
      setReportData(summaryData)
    } catch (error) {
      console.error("❌ Error generating report:", error)
      alert("No se pudo generar el reporte: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = async (format: ReportFormat) => {
    setIsExporting(true)
    try {
      // Prepara los filtros para el servicio (convierte strings vacíos a undefined y programId a number)
      const filters = {
        ...reportConfig,
        startYear: reportConfig.startYear ? Number(reportConfig.startYear) : undefined,
        endYear: reportConfig.endYear ? Number(reportConfig.endYear) : undefined,
        programId: reportConfig.programId ? Number(reportConfig.programId) : undefined,
        state: reportConfig.state || undefined,
        country: reportConfig.country || undefined,
        city: reportConfig.city || undefined,
        address: reportConfig.address || undefined,
        gender: reportConfig.gender || undefined,
      }
      await ReportService.generateGraduateReport(filters, format)
    } catch (e) {
      alert("No se pudo exportar el reporte")
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearFilters = () => {
    setReportConfig({
      gender: "",
      country: "",
      state: "",
      city: "",
      address: "",
      startYear: "",
      endYear: "",
      programId: "",
    })
    setReportData(null)
  }

  return (
    <ReportTemplate
      user={{
        firstName,
        firstLastname,
        email,
        role: user?.role,
        initials,
        ...userProfile
      }}
    >
      <ReportContainer
        filters={reportConfig}
        onFilterChange={handleConfigChange}
        onGenerateReport={generateReport}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        reportData={reportData}
        isGenerating={isGenerating}
        isExporting={isExporting}
        programs={programs}
        isLoadingPrograms={isLoadingPrograms}
        filtersWidthClass="w-full md:w-[420px] lg:w-[480px]"
        contentGapClass="gap-10"
      />
    </ReportTemplate>
  )
}

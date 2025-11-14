"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { ROLES } from "@/lib/services/constants/api.constants"
import { ReportService, ReportFormat, GraduateReportResponse, EducationEmployabilityResponse } from "@/lib/services/profile/report.service"
import { useAcademic } from "@/contexts/academic-context"
import { ReportTemplate } from "@/components/templates/report-template"
import { ReportContainer } from "@/components/organisms/report-container"
import { EducationEmployabilityChart } from "@/components/organisms/education-employability-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/molecules/tabs"

export default function ReportsPage() {
  const router = useRouter()
  const { programs, isLoadingPrograms } = useAcademic()
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
  const user = LocalStorageService.getItem<any>("user")
  const email = user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")
  
  const searchParams = useSearchParams()

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
   const [educationData, setEducationData] = useState<EducationEmployabilityResponse | null>(null)
   const [isGenerating, setIsGenerating] = useState(false)
   const [isExporting, setIsExporting] = useState(false)
   const [isLoadingEducation, setIsLoadingEducation] = useState(false)

  // Determine which tab to open by default. Accepts ?view=employability
  const initialView = searchParams?.get("view") === "employability" ? "employability" : "graduate"

  React.useEffect(() => {
    if (user && user.role && user.role !== ROLES.ADMINISTRATIVE && user.role !== ROLES.DEAN && user.role !== ROLES.ADMIN) {
      router.replace("/dashboard")
    }
  }, [user, router])

  const handleConfigChange = (field: string, value: string) => {
    setReportConfig((prev) => ({ ...prev, [field]: value }))
  }

  const generateReport = async () => {
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
      
      const summaryData = await ReportService.getGraduateReportSummary(filters)
      setReportData(summaryData)
    } catch (error) {
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

  const loadEducationEmployability = async () => {
    setIsLoadingEducation(true)
    try {
      const data = await ReportService.getEducationEmployability()
      setEducationData(data)
    } catch (error) {
      alert("No se pudo cargar el reporte de empleabilidad educativa: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsLoadingEducation(false)
    }
  }

  React.useEffect(() => {
    loadEducationEmployability()
  }, [])

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
      <Tabs defaultValue={initialView} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="graduate">Reportes de Egresados</TabsTrigger>
          <TabsTrigger value="employability">Empleabilidad Educativa</TabsTrigger>
        </TabsList>

        <TabsContent value="graduate" className="mt-6">
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
        </TabsContent>

        <TabsContent value="employability" className="mt-6">
          {isLoadingEducation ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Cargando datos de empleabilidad...</div>
            </div>
          ) : educationData ? (
            <EducationEmployabilityChart data={educationData} />
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-red-500">Error al cargar los datos</div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ReportTemplate>
  )
}

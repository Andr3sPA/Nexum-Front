"use client"

import React, { useState } from "react"
import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/atoms/button"
import { Label } from "@/components/atoms/label"
import { Select } from "@/components/atoms/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import Navbar from "@/components/navbar"
import { LocalStorageService } from "@/lib/services/local-storage.service"

// Report data row interface
interface ReportDataRow {
  category: string
  count: number
  percentage: number
}

// Graduate data interface
interface Graduate {
  id: string
  name: string
  program: string
  gender: string
  employmentStatus: string
  graduationYear: string
}

// Report data interface
interface ReportData {
  program: string
  period: string
  totalCount: number
  graduates: Graduate[]
}

export default function ReportsPage() {
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
  const user = LocalStorageService.getItem<any>("user")
  const email = user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")
  const [reportConfig, setReportConfig] = useState({
    program: "",
    gender: "",
    employmentStatus: "",
    startYear: "",
    endYear: "",
  })

  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleConfigChange = (field: string, value: string) => {
    setReportConfig((prev) => ({ ...prev, [field]: value }))
  }

  const generateReport = async () => {
    setIsGenerating(true)
    // TODO: Implement API call to generate report
    setTimeout(() => {
      // Mock graduates data
      const mockGraduates: Graduate[] = [
        // Ingeniería de Sistemas - Empleados (10)
        { id: "1", name: "Juan Pérez", program: "Ingeniería de Sistemas", gender: "Hombre", employmentStatus: "Empleado", graduationYear: "2020" },
        { id: "2", name: "María López", program: "Ingeniería de Sistemas", gender: "Mujer", employmentStatus: "Empleada", graduationYear: "2021" },
        { id: "3", name: "Carlos Gómez", program: "Ingeniería de Sistemas", gender: "Hombre", employmentStatus: "Empleado", graduationYear: "2019" },
        { id: "4", name: "Laura Ramírez", program: "Ingeniería de Sistemas", gender: "Mujer", employmentStatus: "Empleada", graduationYear: "2022" },
        { id: "5", name: "Andrés Martínez", program: "Ingeniería de Sistemas", gender: "Hombre", employmentStatus: "Empleado", graduationYear: "2020" },
        { id: "6", name: "Valentina Herrera", program: "Ingeniería de Sistemas", gender: "Mujer", employmentStatus: "Empleada", graduationYear: "2021" },
        { id: "7", name: "Santiago Díaz", program: "Ingeniería de Sistemas", gender: "Hombre", employmentStatus: "Empleado", graduationYear: "2022" },
        { id: "8", name: "Camila Vargas", program: "Ingeniería de Sistemas", gender: "Mujer", employmentStatus: "Empleada", graduationYear: "2020" },
        { id: "9", name: "Daniel Morales", program: "Ingeniería de Sistemas", gender: "Hombre", employmentStatus: "Empleado", graduationYear: "2019" },
        { id: "10", name: "Isabella Torres", program: "Ingeniería de Sistemas", gender: "Mujer", employmentStatus: "Empleada", graduationYear: "2021" },
        
        // Ingeniería de Sistemas - Desempleados (10)
        { id: "11", name: "Mateo Rojas", program: "Ingeniería de Sistemas", gender: "Hombre", employmentStatus: "Desempleado", graduationYear: "2022" },
        { id: "12", name: "Sofía Castro", program: "Ingeniería de Sistemas", gender: "Mujer", employmentStatus: "Desempleada", graduationYear: "2020" },
        { id: "13", name: "Sebastián Ortiz", program: "Ingeniería de Sistemas", gender: "Hombre", employmentStatus: "Desempleado", graduationYear: "2021" },
        { id: "14", name: "Gabriela Sánchez", program: "Ingeniería de Sistemas", gender: "Mujer", employmentStatus: "Desempleada", graduationYear: "2019" },
        { id: "15", name: "Nicolás Jiménez", program: "Ingeniería de Sistemas", gender: "Hombre", employmentStatus: "Desempleado", graduationYear: "2022" },
        { id: "16", name: "Valeria Mendoza", program: "Ingeniería de Sistemas", gender: "Mujer", employmentStatus: "Desempleada", graduationYear: "2020" },
        { id: "17", name: "Alejandro Ruiz", program: "Ingeniería de Sistemas", gender: "Hombre", employmentStatus: "Desempleado", graduationYear: "2021" },
        { id: "18", name: "Luciana Flores", program: "Ingeniería de Sistemas", gender: "Mujer", employmentStatus: "Desempleada", graduationYear: "2019" },
        { id: "19", name: "Emilio Reyes", program: "Ingeniería de Sistemas", gender: "Hombre", employmentStatus: "Desempleado", graduationYear: "2022" },
        { id: "20", name: "Antonella Medina", program: "Ingeniería de Sistemas", gender: "Mujer", employmentStatus: "Desempleada", graduationYear: "2020" },
        
        // Other programs (keeping the original ones)
        { id: "21", name: "Carlos Rodríguez", program: "Ingeniería Industrial", gender: "Hombre", employmentStatus: "Desempleado", graduationYear: "2019" },
        { id: "22", name: "Ana Martínez", program: "Medicina", gender: "Mujer", employmentStatus: "Empleada", graduationYear: "2022" },
        { id: "23", name: "Alex Sánchez", program: "Derecho", gender: "No binario", employmentStatus: "Empleado", graduationYear: "2020" },
      ]
      
      // Filter graduates based on selected criteria
      let filteredGraduates = [...mockGraduates]
      
      if (reportConfig.program && reportConfig.program !== "todos") {
        const programMap: Record<string, string> = {
          "ingenieria-sistemas": "Ingeniería de Sistemas",
          "ingenieria-industrial": "Ingeniería Industrial",
          "medicina": "Medicina",
          "derecho": "Derecho",
          "administracion": "Administración"
        }
        filteredGraduates = filteredGraduates.filter(g => g.program === programMap[reportConfig.program])
      }
      
      if (reportConfig.gender && reportConfig.gender !== "todos") {
        filteredGraduates = filteredGraduates.filter(g => g.gender === reportConfig.gender)
      }
      
      if (reportConfig.employmentStatus && reportConfig.employmentStatus !== "todos") {
        filteredGraduates = filteredGraduates.filter(g => {
          // Handle both masculine and feminine forms of employment status
          if (reportConfig.employmentStatus === "Empleado") {
            return g.employmentStatus === "Empleado" || g.employmentStatus === "Empleada"
          } else if (reportConfig.employmentStatus === "Desempleado") {
            return g.employmentStatus === "Desempleado" || g.employmentStatus === "Desempleada"
          }
          return g.employmentStatus === reportConfig.employmentStatus
        })
      }
      
      if (reportConfig.startYear && reportConfig.endYear) {
        const startYear = parseInt(reportConfig.startYear)
        const endYear = parseInt(reportConfig.endYear)
        filteredGraduates = filteredGraduates.filter(g => {
          const gradYear = parseInt(g.graduationYear)
          return gradYear >= startYear && gradYear <= endYear
        })
      }
      
      setReportData({
        program: reportConfig.program ? (reportConfig.program === "todos" ? "Todos los programas" : mockGraduates.find(g => g.program === reportConfig.program)?.program || reportConfig.program) : "Todos",
        period: `${reportConfig.startYear} - ${reportConfig.endYear}`,
        totalCount: filteredGraduates.length,
        graduates: filteredGraduates
      })
      
      setIsGenerating(false)
    }, 2000)
  }

  const exportToExcel = () => {
    // TODO: Implement Excel export functionality
    console.log("Exporting to Excel...")
  }

  return (
    <>
      <Navbar user={{
        firstName,
        firstLastname,
        email,
        role: user?.role,
        initials,
        ...userProfile
      }} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold udea-primary-text">Generar Reportes</CardTitle>
                <CardDescription>
                  Configura los parámetros para generar reportes estadísticos de egresados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program">Programa</Label>
                    <Select
                      value={reportConfig.program}
                      onChange={(e) => handleConfigChange("program", e.target.value)}
                    >
                      <option value="">Seleccionar programa</option>
                      <option value="ingenieria-sistemas">Ingeniería de Sistemas</option>
                      <option value="ingenieria-industrial">Ingeniería Industrial</option>
                      <option value="medicina">Medicina</option>
                      <option value="derecho">Derecho</option>
                      <option value="administracion">Administración</option>
                      <option value="todos">Todos los programas</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select
                      value={reportConfig.gender}
                      onChange={(e) => handleConfigChange("gender", e.target.value)}
                    >
                      <option value="">Seleccionar género</option>
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                      <option value="No binario">No binario</option>
                      <option value="todos">Todos</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Empleabilidad</Label>
                    <Select
                      value={reportConfig.employmentStatus}
                      onChange={(e) => handleConfigChange("employmentStatus", e.target.value)}
                    >
                      <option value="">Seleccionar estado</option>
                      <option value="Empleado">Empleado</option>
                      <option value="Desempleado">Desempleado</option>
                      <option value="todos">Todos</option>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startYear">Año Inicial</Label>
                    <Select
                      value={reportConfig.startYear}
                      onChange={(e) => handleConfigChange("startYear", e.target.value)}
                    >
                      <option value="">Seleccionar año</option>
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endYear">Año Final</Label>
                    <Select
                      value={reportConfig.endYear}
                      onChange={(e) => handleConfigChange("endYear", e.target.value)}
                    >
                      <option value="">Seleccionar año</option>
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={generateReport}
                    className="udea-primary"
                    disabled={
                      !reportConfig.startYear ||
                      !reportConfig.endYear ||
                      isGenerating
                    }
                  >
                    {isGenerating ? "Generando..." : "Generar Reporte"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {reportData && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl udea-primary-text">Reporte Generado</CardTitle>
                    <CardDescription>
                      {reportData.program} ({reportData.period})
                    </CardDescription>
                  </div>
                  <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Exportar Excel
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Cantidad de Egresados: {reportData.totalCount}</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Programa</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Género</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Estado Laboral</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Año de Graduación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.graduates.map((graduate) => (
                          <tr key={graduate.id}>
                            <td className="border border-gray-300 px-4 py-2">{graduate.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{graduate.program}</td>
                            <td className="border border-gray-300 px-4 py-2">{graduate.gender}</td>
                            <td className="border border-gray-300 px-4 py-2">{graduate.employmentStatus}</td>
                            <td className="border border-gray-300 px-4 py-2">{graduate.graduationYear}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

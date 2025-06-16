"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet } from "lucide-react"

// Report data row interface
interface ReportDataRow {
  category: string
  count: number
  percentage: number
}

// Report data interface
interface ReportData {
  program: string
  type: string
  period: string
  data: ReportDataRow[]
}

export default function ReportsPage() {
  const [reportConfig, setReportConfig] = useState({
    program: "",
    reportType: "",
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
      // Mock report data
      setReportData({
        program: reportConfig.program,
        type: reportConfig.reportType,
        period: `${reportConfig.startYear} - ${reportConfig.endYear}`,
        data:
          reportConfig.reportType === "genero"
            ? [
                { category: "Hombre", count: 150, percentage: 60 },
                { category: "Mujer", count: 95, percentage: 38 },
                { category: "No binario", count: 5, percentage: 2 },
              ]
            : [{ category: "Total Egresados", count: 250, percentage: 100 }],
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
      <Navbar />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program">Seleccione Programa</Label>
                    <Select
                      value={reportConfig.program}
                      onValueChange={(value) => handleConfigChange("program", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar programa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingenieria-sistemas">Ingeniería de Sistemas</SelectItem>
                        <SelectItem value="ingenieria-industrial">Ingeniería Industrial</SelectItem>
                        <SelectItem value="medicina">Medicina</SelectItem>
                        <SelectItem value="derecho">Derecho</SelectItem>
                        <SelectItem value="administracion">Administración</SelectItem>
                        <SelectItem value="todos">Todos los programas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportType">Tipo de Reporte</Label>
                    <Select
                      value={reportConfig.reportType}
                      onValueChange={(value) => handleConfigChange("reportType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de reporte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genero">Género</SelectItem>
                        <SelectItem value="cantidad">Cantidad de Egresados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startYear">Año Inicial</Label>
                    <Select
                      value={reportConfig.startYear}
                      onValueChange={(value) => handleConfigChange("startYear", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar año" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endYear">Año Final</Label>
                    <Select
                      value={reportConfig.endYear}
                      onValueChange={(value) => handleConfigChange("endYear", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar año" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={generateReport}
                    className="udea-primary"
                    disabled={
                      !reportConfig.program ||
                      !reportConfig.reportType ||
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
                      {reportData.program} - {reportData.type} ({reportData.period})
                    </CardDescription>
                  </div>
                  <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Exportar Excel
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Categoría</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Cantidad</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.map((row: ReportDataRow, index: number) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{row.category}</td>
                            <td className="border border-gray-300 px-4 py-2">{row.count}</td>
                            <td className="border border-gray-300 px-4 py-2">{row.percentage}%</td>
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

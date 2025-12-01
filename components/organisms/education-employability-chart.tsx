import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { EducationEmployabilityResponse } from "@/lib/services/profile/report.service"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface EducationEmployabilityChartProps {
  data: EducationEmployabilityResponse
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function EducationEmployabilityChart({ data }: EducationEmployabilityChartProps) {
  // Prepare data for program breakdown chart
  const programChartData = data.byProgram.map((program, index) => ({
    name: program.programName.length > 20 ? program.programName.substring(0, 20) + '...' : program.programName,
    fullName: program.programName,
    graduates: program.totalGraduates,
    employed: program.employedGraduates,
    rate: Math.round(program.employabilityRate * 100) / 100
  }))

  // Prepare data for overall pie chart
  const overallPieData = [
    { name: 'Empleados', value: data.employedGraduates, color: '#10b981' },
    { name: 'No Empleados', value: data.totalGraduates - data.employedGraduates, color: '#ef4444' }
  ]

  return (
    <div className="space-y-6">
      {/* Overall Distribution Pie Chart */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Distribución General de Empleabilidad
          </CardTitle>
          <CardDescription className="text-blue-600">
            Proporción de egresados empleados vs no empleados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overallPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {overallPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Program Breakdown Bar Chart */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Empleabilidad por Programa
          </CardTitle>
          <CardDescription className="text-purple-600">
            Comparación de tasas de empleabilidad entre diferentes programas académicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={programChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'rate') return [`${value}%`, 'Tasa de Empleabilidad']
                  return [value, name === 'graduates' ? 'Total Egresados' : 'Empleados']
                }}
                labelFormatter={(label) => {
                  const item = programChartData.find(d => d.name === label)
                  return item ? item.fullName : label
                }}
              />
              <Bar dataKey="rate" fill="#8b5cf6" name="Tasa %" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Program Details Table */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            Detalles por Programa
          </CardTitle>
          <CardDescription className="text-amber-600">
            Información detallada de empleabilidad por programa académico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-amber-50">
                  <th className="text-left p-3 font-semibold text-amber-800">Programa</th>
                  <th className="text-right p-3 font-semibold text-amber-800">Total Egresados</th>
                  <th className="text-right p-3 font-semibold text-amber-800">Empleados</th>
                  <th className="text-right p-3 font-semibold text-amber-800">Tasa de Empleabilidad</th>
                </tr>
              </thead>
              <tbody>
                {data.byProgram.map((program, index) => (
                  <tr key={index} className="border-b hover:bg-amber-50/50 transition-colors">
                    <td className="p-3 font-medium">{program.programName}</td>
                    <td className="text-right p-3">{program.totalGraduates}</td>
                    <td className="text-right p-3 text-emerald-600 font-semibold">{program.employedGraduates}</td>
                    <td className="text-right p-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        program.employabilityRate >= 80 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : program.employabilityRate >= 60 
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {Math.round(program.employabilityRate)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

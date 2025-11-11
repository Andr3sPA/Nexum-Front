import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { EducationEmployabilityResponse } from "@/lib/services/profile/report.service"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface EducationEmployabilityChartProps {
  data: EducationEmployabilityResponse
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

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
    { name: 'Empleados', value: data.employedGraduates, color: '#00C49F' },
    { name: 'No Empleados', value: data.totalGraduates - data.employedGraduates, color: '#FF8042' }
  ]

  return (
    <div className="space-y-6">
      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Egresados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalGraduates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Egresados Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.employedGraduates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Empleabilidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(data.employabilityRate)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución General de Empleabilidad</CardTitle>
          <CardDescription>
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
      <Card>
        <CardHeader>
          <CardTitle>Empleabilidad por Programa</CardTitle>
          <CardDescription>
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
              <Bar dataKey="rate" fill="#8884d8" name="Tasa %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Program Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles por Programa</CardTitle>
          <CardDescription>
            Información detallada de empleabilidad por programa académico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Programa</th>
                  <th className="text-right p-2">Total Egresados</th>
                  <th className="text-right p-2">Empleados</th>
                  <th className="text-right p-2">Tasa de Empleabilidad</th>
                </tr>
              </thead>
              <tbody>
                {data.byProgram.map((program, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{program.programName}</td>
                    <td className="text-right p-2">{program.totalGraduates}</td>
                    <td className="text-right p-2">{program.employedGraduates}</td>
                    <td className="text-right p-2">{Math.round(program.employabilityRate)}%</td>
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

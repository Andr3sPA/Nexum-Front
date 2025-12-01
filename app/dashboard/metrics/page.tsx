"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { DashboardTemplate } from "@/components/templates/dashboard-template"
import { ROLES } from "@/lib/services/constants/api.constants"
import { MetricsService, MetricsResponse } from "@/lib/services/profile/metrics.service"
import { ReportService, EducationEmployabilityResponse } from "@/lib/services/profile/report.service"
import { ApplicationService, ApplicationMetricsResponse, ApplicationTimelineResponse } from "@/lib/services/opportunity/application.service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/molecules/card"
import { ReportStatCard } from "@/components/atoms/report-stat-card"
import { EducationEmployabilityChart } from "@/components/organisms/education-employability-chart"
import { useAcademic } from "@/contexts/academic-context"
import { ProgramVersionService } from "@/lib/services/catalog/program-version.service"
import { UserService, UserResponse } from "@/lib/services/profile/user.service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/molecules/tabs"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts"

const PIE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a28fd0", "#8dd1e1"]

export default function DashboardMetricsPage() {
  const router = useRouter()

  const user = LocalStorageService.getItem<any>("user")
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
  const email = user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")

  const [metrics, setMetrics] = React.useState<MetricsResponse | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [educationData, setEducationData] = React.useState<EducationEmployabilityResponse | null>(null)
  const [isLoadingEducation, setIsLoadingEducation] = React.useState(false)
  const [applicationData, setApplicationData] = React.useState<ApplicationMetricsResponse | null>(null)
  const [isLoadingApplications, setIsLoadingApplications] = React.useState(false)
  const [applicationTimeline, setApplicationTimeline] = React.useState<ApplicationTimelineResponse | null>(null)
  const [isLoadingTimeline, setIsLoadingTimeline] = React.useState(false)
  const [timelineMonths, setTimelineMonths] = React.useState(12)

  const { programs } = useAcademic()
  const [programNames, setProgramNames] = React.useState<Record<number, string>>({})
  const [registrationsSeries, setRegistrationsSeries] = React.useState<Array<{ month: string; count: number }>>([])
  const [monthsRange, setMonthsRange] = React.useState<number>(12)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // helper to build months array for the selected range
  const buildMonths = (rangeMonths: number) => {
    const months: string[] = []
    const now = new Date()
    for (let i = rangeMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleString(undefined, { month: 'short', year: 'numeric' })
      months.push(label)
    }
    return months
  }

  const loadEducationEmployability = React.useCallback(async () => {
    let mounted = true
    setIsLoadingEducation(true)
    try {
      const data = await ReportService.getEducationEmployability()
      if (!mounted) return
      setEducationData(data)
    } catch (error) {
      if (!mounted) return
      console.error('Error loading education employability:', error)
    } finally {
      if (!mounted) return
      setIsLoadingEducation(false)
    }
  }, [])

  const loadApplicationMetrics = React.useCallback(async () => {
    let mounted = true
    setIsLoadingApplications(true)
    try {
      const data = await ApplicationService.getApplicationMetrics()
      if (!mounted) return
      setApplicationData(data)
    } catch (error) {
      if (!mounted) return
      console.error('Error loading application metrics:', error)
    } finally {
      if (!mounted) return
      setIsLoadingApplications(false)
    }
  }, [])

  const loadApplicationTimeline = React.useCallback(async () => {
    let mounted = true
    setIsLoadingTimeline(true)
    try {
      const data = await ApplicationService.getApplicationTimeline(timelineMonths)
      if (!mounted) return
      setApplicationTimeline(data)
    } catch (error) {
      if (!mounted) return
      console.error('Error loading application timeline:', error)
    } finally {
      if (!mounted) return
      setIsLoadingTimeline(false)
    }
  }, [timelineMonths])

  const load = React.useCallback(async (opts?: { force?: boolean }) => {
    let mounted = true
    // prevent double refresh UI
    if (opts?.force) setIsRefreshing(true)

    try {
      const user = LocalStorageService.getItem<any>("user")
      if (!user) {
        router.replace('/login')
        return
      }
      if (!(user.role === ROLES.ADMIN || user.role === ROLES.ADMINISTRATIVE || user.role === ROLES.DEAN)) {
        router.replace('/dashboard')
        return
      }

      setLoading(true)
      try {
        const data = await MetricsService.getMetrics()
        if (!mounted) return
        setMetrics(data)

        // Fetch program version names for display (if any)
        try {
          const ids = data.graduatesByProgramVersion
            .map(p => p.programVersionId)
            .filter((id): id is number => typeof id === 'number')
          const uniqueIds = Array.from(new Set(ids))
          const nameMap: Record<number, string> = {}
          await Promise.all(uniqueIds.map(async (id) => {
            try {
              const pv = await ProgramVersionService.getById(id)
              nameMap[id] = pv.program?.name || `Programa #${pv.id}`
            } catch (err) {
              // fallback to id
              nameMap[id] = `Programa #${id}`
            }
          }))
          if (!mounted) return
          setProgramNames(nameMap)
        } catch (err) {
          console.error('Error loading program names', err)
        }

        // Build registrations-over-time series: fetch users list and aggregate by month
        try {
          const users: UserResponse[] = await UserService.getAll()
          const months = buildMonths(monthsRange)
          const counts: Record<string, number> = {}
          months.forEach(m => (counts[m] = 0))
          users.forEach(u => {
            if (!u.creationDate) return
            const d = new Date(u.creationDate)
            if (isNaN(d.getTime())) return
            const label = d.toLocaleString(undefined, { month: 'short', year: 'numeric' })
            if (!(label in counts)) return
            counts[label] = (counts[label] || 0) + 1
          })
          const series = months.map(m => ({ month: m, count: counts[m] || 0 }))
          if (!mounted) return
          setRegistrationsSeries(series)
        } catch (err) {
          console.error('Error building registrations series', err)
        }

        // Load education employability data
        await loadEducationEmployability()
        
        // Load application metrics data
        await loadApplicationMetrics()
        await loadApplicationTimeline()
      } catch (e: any) {
        if (!mounted) return
        // Manejo explícito de códigos comunes
        const status = e?.status
        if (status === 401 || status === 403) {
          // Forzar logout local y redirigir a login
          LocalStorageService.removeItem('user')
          router.replace('/login')
          return
        }

        // Mostrar mensaje más detallado si viene del servidor
        const serverBody = e?.body
        if (serverBody && typeof serverBody === 'object') {
          const msg = serverBody.message || JSON.stringify(serverBody)
          setError(`No se pudo obtener las métricas: ${msg}`)
        } else {
          setError(e?.message || 'Error al cargar métricas')
        }
        console.error('Metrics load error:', e)
      } finally {
        if (!mounted) return
        setLoading(false)
        setIsRefreshing(false)
      }
    } catch (outer) {
      console.error('Unexpected error in metrics load', outer)
      setIsRefreshing(false)
      setLoading(false)
    }
    // no explicit return of mounted needed here (mounted captured above)
  }, [router, monthsRange, loadEducationEmployability, loadApplicationMetrics, loadApplicationTimeline])

  // initial load
  React.useEffect(() => {
    load()
  }, [load])

  return (
    <DashboardTemplate user={{ firstName, firstLastname, email, role: user?.role, initials, ...userProfile }}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Métricas Institucionales</CardTitle>
                <CardDescription>Resumen rápido de indicadores clave</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && <div className="py-12 text-center">Cargando métricas...</div>}
            {error && <div className="py-6 text-red-600">{error}</div>}

            {!loading && metrics && (
              <Tabs defaultValue="institutional" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="institutional">Métricas Institucionales</TabsTrigger>
                  <TabsTrigger value="employability">Empleabilidad Educativa</TabsTrigger>
                  <TabsTrigger value="applications">Aplicaciones a Oportunidades</TabsTrigger>
                </TabsList>

                <TabsContent value="institutional" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      <ReportStatCard title="Total Usuarios" value={metrics.totalUsers} variant="primary" />
                      <ReportStatCard title="Total Egresados" value={metrics.totalGraduates} variant="info" />
                      <ReportStatCard title="Empleos Actuales" value={metrics.currentJobsCount} variant="success" />
                      <ReportStatCard title="Empleos Relacionados" value={metrics.relatedToProgramJobsCount} variant="warning" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Usuarios por Rol</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                              <PieChart>
                                <RechartTooltip />
                                <Pie
                                  data={Object.entries(metrics.usersByRole).map(([role, count]) => ({ name: role, value: count }))}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  label
                                >
                                  {Object.keys(metrics.usersByRole).map((_, idx) => (
                                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Graduados por Programa</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                              <BarChart data={metrics.graduatesByProgramVersion.map(p => ({
                                name: p.programVersionId ? (programNames[p.programVersionId] || `#${p.programVersionId}`) : 'N/A',
                                value: p.count
                              }))}>
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <RechartTooltip />
                                <Bar dataKey="value" fill="#82ca9d" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Registros (últimos 12 meses)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                              <LineChart data={registrationsSeries} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <RechartTooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      <ReportStatCard
                        title="Participación"
                        value={metrics.graduateParticipationCount}
                        variant="secondary"
                        subtitle="Número total de registros en participaciones de egresados (cada fila = una participación en la base de datos)."
                        info="Contado directo desde la tabla de participaciones (GraduateParticipation). Si quieres el número de egresados únicos, se requiere cambiar la consulta a un COUNT DISTINCT sobre el id del egresado."
                      />
                      <ReportStatCard
                        title="Procesos de innovación"
                        value={metrics.innovationProcessCount}
                        variant="secondary"
                        subtitle="Total de procesos de innovación registrados en la base de datos."
                        info="Contado directo desde la tabla de procesos de innovación (InnovationProcess). Incluye todos los registros históricos."
                      />
                      <ReportStatCard
                        title="Opiniones de programa"
                        value={metrics.programOpinionCount}
                        variant="secondary"
                        subtitle="Cantidad total de opiniones/valoraciones sobre programas (registros)."
                        info="Contado desde la tabla de opiniones de programa (ProgramOpinion). Es el número de filas; no es un promedio ni un score."
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="employability" className="mt-6">
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                      <CardTitle className="text-xl text-emerald-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Empleabilidad Educativa
                      </CardTitle>
                      <CardDescription className="text-emerald-600">
                        Métricas de empleabilidad de egresados por programa académico
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {isLoadingEducation ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="text-lg text-emerald-600">Cargando datos de empleabilidad...</div>
                        </div>
                      ) : educationData ? (
                        <div className="space-y-6">
                          {/* Summary Stats Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                              <div className="text-sm font-medium text-blue-600 mb-1">Total Egresados</div>
                              <div className="text-2xl font-bold text-blue-800">{educationData.totalGraduates}</div>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                              <div className="text-sm font-medium text-emerald-600 mb-1">Egresados Empleados</div>
                              <div className="text-2xl font-bold text-emerald-800">{educationData.employedGraduates}</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                              <div className="text-sm font-medium text-purple-600 mb-1">Tasa de Empleabilidad</div>
                              <div className="text-2xl font-bold text-purple-800">{Math.round(educationData.employabilityRate)}%</div>
                            </div>
                          </div>
                          
                          {/* Charts */}
                          <EducationEmployabilityChart data={educationData} />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-64">
                          <div className="text-lg text-red-500">Error al cargar los datos de empleabilidad</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="applications" className="mt-6">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Aplicaciones a Oportunidades
                      </CardTitle>
                      <CardDescription className="text-blue-600">
                        Métricas de aplicaciones de egresados a oportunidades laborales
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {isLoadingApplications ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="text-lg text-blue-600">Cargando datos de aplicaciones...</div>
                        </div>
                      ) : applicationData ? (
                        <div className="space-y-6">
                          {/* Summary Stats Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                              <div className="text-sm font-medium text-blue-600 mb-1">Total de Aplicaciones</div>
                              <div className="text-2xl font-bold text-blue-800">{applicationData.totalApplications}</div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                              <div className="text-sm font-medium text-amber-600 mb-1">Últimos 6 meses</div>
                              <div className="text-2xl font-bold text-amber-800">{applicationData.applicationsLast6Months}</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                              <div className="text-sm font-medium text-purple-600 mb-1">Últimos 12 meses</div>
                              <div className="text-2xl font-bold text-purple-800">{applicationData.applicationsLast12Months}</div>
                            </div>
                          </div>

                          {/* Date Range Selector */}
                          <div className="mb-6 flex items-center gap-4">
                            <label className="text-sm font-medium text-blue-700">Rango de tiempo:</label>
                            <select 
                              value={timelineMonths} 
                              onChange={(e) => setTimelineMonths(Number(e.target.value))}
                              className="px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value={6}>Últimos 6 meses</option>
                              <option value={12}>Últimos 12 meses</option>
                              <option value={24}>Últimos 24 meses</option>
                            </select>
                          </div>

                          {/* Application Trend Chart */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-blue-800">Tendencia de Aplicaciones</CardTitle>
                              <CardDescription className="text-blue-600">
                                Evolución de aplicaciones en el tiempo
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {isLoadingTimeline ? (
                                <div className="flex justify-center items-center h-64">
                                  <div className="text-lg text-blue-600">Cargando timeline...</div>
                                </div>
                              ) : applicationTimeline ? (
                                <div style={{ width: '100%', height: 350 }}>
                                  <ResponsiveContainer>
                                    <LineChart
                                      data={applicationTimeline.timeline.map(item => ({
                                        date: item.date, // Keep as string, XAxis will handle formatting
                                        count: item.count
                                      }))}
                                      margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 60,
                                      }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                      <XAxis 
                                        dataKey="date" 
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        tickFormatter={(value) => {
                                          // Format the date string for display
                                          const date = new Date(value)
                                          return date.toLocaleDateString('es', { month: 'short', day: 'numeric' })
                                        }}
                                      />
                                      <YAxis />
                                      <RechartTooltip 
                                        formatter={(value, name) => [value, 'Aplicaciones']}
                                        labelFormatter={(label) => `Fecha: ${label}`}
                                      />
                                      <Line 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        dot={{ fill: "#3b82f6", r: 4 }}
                                        activeDot={{ r: 6 }}
                                      />
                                    </LineChart>
                                  </ResponsiveContainer>
                                </div>
                              ) : (
                                <div className="flex justify-center items-center h-64">
                                  <div className="text-lg text-red-500">Error al cargar el timeline</div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-64">
                          <div className="text-lg text-red-500">Error al cargar los datos de aplicaciones</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  )
}

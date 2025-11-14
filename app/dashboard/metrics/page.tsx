"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { DashboardTemplate } from "@/components/templates/dashboard-template"
import { ROLES } from "@/lib/services/constants/api.constants"
import { MetricsService, MetricsResponse } from "@/lib/services/profile/metrics.service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/molecules/card"
import { ReportStatCard } from "@/components/atoms/report-stat-card"
import { useAcademic } from "@/contexts/academic-context"
import { ProgramVersionService } from "@/lib/services/catalog/program-version.service"
import { UserService, UserResponse } from "@/lib/services/profile/user.service"
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
  }, [router, monthsRange])

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
          )}
        </CardContent>
      </Card>
      </div>
    </DashboardTemplate>
  )
}

"use client"

import Link from "next/link"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChart3 } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROLES } from "@/lib/services/constants/api.constants"

export default function DeanDashboardPage() {
  const router = useRouter()
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  useEffect(() => {
    if (!userProfile || userProfile.role !== ROLES.DEAN) {
      router.replace("/login")
    }
  }, [router, userProfile])
  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
  const user = LocalStorageService.getItem<any>("user")
  const email = user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")
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
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="max-w-6xl mx-auto">
              <Card className="mb-8">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold udea-primary-text">Panel de Decanatura</CardTitle>
                  <CardDescription className="text-lg mt-4">
                    Consulta información de egresados y genera reportes estadísticos
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buscar Egresados */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href={ROUTES.DEAN.SEARCH_GRADUATES}>
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl udea-primary-text">Buscar Egresados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center">
                        Consulta y filtra información de egresados por diferentes criterios académicos y profesionales.
                      </p>
                    </CardContent>
                  </Link>
                </Card>

                {/* Generar Reportes */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href={ROUTES.DEAN.REPORTS}>
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-green-600" />
                      </div>
                      <CardTitle className="text-xl udea-primary-text">Generar Reportes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center">
                        Genera reportes estadísticos detallados de egresados para análisis institucional.
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

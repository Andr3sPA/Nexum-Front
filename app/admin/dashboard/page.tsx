"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { Search, FileText, UserPlus } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import RegisterGraduateModal from "@/components/organisms/modals/register-graduate-modal"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROLES } from "@/lib/services/constants/api.constants"

export default function AdminDashboardPage() {
  const router = useRouter()
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  useEffect(() => {
    if (!userProfile || userProfile.role !== ROLES.ADMINISTRATIVE) {
      router.replace("/login")
    }
  }, [router, userProfile])

  const [showRegisterModal, setShowRegisterModal] = useState(false)

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
                  <CardTitle className="text-3xl font-bold udea-primary-text">Panel Administrativo</CardTitle>
                  <CardDescription className="text-lg mt-4">
                    Gestiona la información de egresados y genera reportes
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Buscar Egresados */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href={ROUTES.ADMIN.SEARCH_GRADUATES}>
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl udea-primary-text">Buscar Egresados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center">
                        Busca y filtra egresados por diferentes criterios como programa, año de graduación, ubicación,
                        etc.
                      </p>
                    </CardContent>
                  </Link>
                </Card>

                {/* Generar Reportes */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href={ROUTES.ADMIN.REPORTS}>
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-green-600" />
                      </div>
                      <CardTitle className="text-xl udea-primary-text">Generar Reportes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center">
                        Genera reportes estadísticos de egresados por programa, género, años y exporta en Excel.
                      </p>
                    </CardContent>
                  </Link>
                </Card>

                {/* Registrar Egresado */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <UserPlus className="w-8 h-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl udea-primary-text">Registrar Egresado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      Registra un nuevo egresado en el sistema y completa su información de perfil.
                    </p>
                    <div className="mt-4 text-center">
                      <Button className="udea-primary" onClick={() => setShowRegisterModal(true)}>
                        Registrar Nuevo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Graduate Modal */}
      <RegisterGraduateModal open={showRegisterModal} onOpenChange={setShowRegisterModal} />
    </>
  )
}

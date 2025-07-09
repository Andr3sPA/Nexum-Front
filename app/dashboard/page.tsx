"use client"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, ArrowRight, Users, BarChart3 } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { ROLES } from "@/lib/services/constants/api.constants"

export default function EgresadoDashboardPage() {
  const router = useRouter()
  const user = LocalStorageService.getItem<{ name?: string; email?: string; initials?: string; role?: string }>("user")
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  useEffect(() => {
    console.log("user:", user);
    console.log("userProfile:", userProfile);
    console.log("user.role:", user?.role);
    console.log("ROLES.GRADUATE:", ROLES.GRADUATE);
    if (!user || user.role !== ROLES.GRADUATE) {
      router.replace("/login")
    }
  }, [router, user])
  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
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
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold udea-primary-text">
                  ¡Bienvenido a la Plataforma de Egresados UdeA!
                </CardTitle>
                <CardDescription className="text-lg mt-4">
                  Nos alegra tenerte de vuelta. Desde aquí puedes actualizar tu información personal, académica y
                  laboral para mantenernos conectados contigo.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <Link href={ROUTES.PROFILE} className="group">
                    <div className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer border border-green-200 hover:border-green-300">
                      <div className="flex items-center justify-center mb-3">
                        <User className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold udea-primary-text mb-2 group-hover:text-green-700">
                        Actualiza tu Perfil
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Mantén tu información personal y profesional actualizada
                      </p>
                      <div className="flex items-center justify-center text-green-600 group-hover:text-green-700">
                        <span className="text-sm font-medium">Ir al perfil</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center mb-3">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-blue-800 mb-2">Conecta con Egresados</h3>
                    <p className="text-sm text-gray-600">Participa en eventos y actividades de la comunidad</p>
                  </div>
                  <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-center mb-3">
                      <BarChart3 className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Oportunidades</h3>
                    <p className="text-sm text-gray-600">Descubre nuevas oportunidades académicas y laborales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

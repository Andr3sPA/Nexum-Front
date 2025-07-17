"use client"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { User, ArrowRight, Users, BarChart3, FileText, Search, UserPlus } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { ROLES } from "@/lib/services/constants/api.constants"
import RegisterGraduateModal from "@/components/organisms/modals/register-graduate-modal"

export default function UnifiedDashboardPage() {
  const router = useRouter()
  const user = LocalStorageService.getItem<{ name?: string; email?: string; initials?: string; role?: string }>("user")
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [router, user])

  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
  const email = user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")
  const role = user?.role

  // Opciones por rol
  let cards: any[] = []

  if (role === ROLES.ADMINISTRATIVE) {
    cards = [
      {
        href: "/search-graduates",
        icon: <Search className="w-8 h-8 text-blue-600" />,
        title: "Buscar Egresados",
        description: "Busca y filtra egresados por diferentes criterios como programa, año de graduación, ubicación, etc.",
        color: "blue",
      },
      {
        href: ROUTES.ADMIN.REPORTS,
        icon: <FileText className="w-8 h-8 text-green-600" />,
        title: "Generar Reportes",
        description: "Genera reportes estadísticos de egresados por programa, género, años y exporta en Excel.",
        color: "green",
      },
      {
        href: "#register-graduate",
        icon: <UserPlus className="w-8 h-8 text-purple-600" />,
        title: "Registrar Egresado",
        description: "Registra un nuevo egresado en el sistema y completa su información de perfil.",
        color: "purple",
        onClick: () => setShowRegisterModal(true),
        isButton: true,
      },
    ]
  } else if (role === ROLES.DEAN) {
    cards = [
      {
        href: "/search-graduates",
        icon: <Users className="w-8 h-8 text-blue-600" />,
        title: "Buscar Egresados",
        description: "Consulta y filtra información de egresados por diferentes criterios académicos y profesionales.",
        color: "blue",
      },
      {
        href: ROUTES.DEAN.REPORTS,
        icon: <BarChart3 className="w-8 h-8 text-green-600" />,
        title: "Generar Reportes",
        description: "Genera reportes estadísticos detallados de egresados para análisis institucional.",
        color: "green",
      },
    ]
  } else if (role === ROLES.GRADUATE) {
    cards = [
      {
        href: ROUTES.PROFILE,
        icon: <User className="w-8 h-8 text-green-600" />,
        title: "Actualiza tu Perfil",
        description: "Mantén tu información personal y profesional actualizada",
        color: "green",
      },
      {
        href: "#community",
        icon: <Users className="w-8 h-8 text-blue-600" />,
        title: "Conecta con Egresados",
        description: "Participa en eventos y actividades de la comunidad",
        color: "blue",
        disabled: true,
      },
      {
        href: "#opportunities",
        icon: <BarChart3 className="w-8 h-8 text-yellow-600" />,
        title: "Oportunidades",
        description: "Descubre nuevas oportunidades académicas y laborales",
        color: "yellow",
        disabled: true,
      },
    ]
  }

  return (
    <>
      <Navbar user={{
        firstName,
        firstLastname,
        email,
        role,
        initials,
        ...userProfile
      }} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card className="max-w-6xl mx-auto mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold udea-primary-text">
                  ¡Bienvenido a la Plataforma de Egresados UdeA!
                </CardTitle>
                <CardDescription className="text-lg mt-4">
                  {role === ROLES.ADMINISTRATIVE && "Gestiona la información de egresados y genera reportes"}
                  {role === ROLES.DEAN && "Consulta información de egresados y genera reportes estadísticos"}
                  {role === ROLES.GRADUATE && "Nos alegra tenerte de vuelta. Desde aquí puedes actualizar tu información personal, académica y laboral para mantenernos conectados contigo."}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`grid grid-cols-1 md:grid-cols-${cards.length > 2 ? 3 : 2} gap-6 mt-8`}>
                  {cards.map((card, idx) =>
                    card.isButton ? (
                      <div
                        key={idx}
                        className={`p-6 bg-${card.color}-50 rounded-lg hover:bg-${card.color}-100 transition-colors cursor-pointer border border-${card.color}-200 hover:border-${card.color}-300 flex flex-col items-center justify-between`}
                        onClick={card.onClick}
                      >
                        <div className="flex items-center justify-center mb-3">{card.icon}</div>
                        <h3 className={`font-semibold udea-primary-text mb-2 group-hover:text-${card.color}-700`}>
                          {card.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                        <div className={`flex items-center justify-center text-${card.color}-600 group-hover:text-${card.color}-700`}>
                          <span className="text-sm font-medium">Registrar Nuevo</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={idx}
                        href={card.href}
                        className={`group ${card.disabled ? "pointer-events-none opacity-60" : ""}`}
                      >
                        <div className={`p-6 bg-${card.color}-50 rounded-lg hover:bg-${card.color}-100 transition-colors cursor-pointer border border-${card.color}-200 hover:border-${card.color}-300 flex flex-col items-center justify-between`}>
                          <div className="flex items-center justify-center mb-3">{card.icon}</div>
                          <h3 className={`font-semibold udea-primary-text mb-2 group-hover:text-${card.color}-700`}>
                            {card.title}
                      </h3>
                          <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                          <div className={`flex items-center justify-center text-${card.color}-600 group-hover:text-${card.color}-700`}>
                            <span className="text-sm font-medium">Ir</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Modal para registrar egresado solo para admin */}
      {role === ROLES.ADMINISTRATIVE && (
        <RegisterGraduateModal open={showRegisterModal} onOpenChange={setShowRegisterModal} />
      )}
    </>
  )
}

"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, ArrowRight, Users, BarChart3, FileText, Search, UserPlus } from "lucide-react"
import { ROUTES } from "@/lib/routes"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { ROLES } from "@/lib/services/constants/api.constants"
import RegisterGraduateModal from "@/components/organisms/modals/register-graduate-modal"
import { DashboardTemplate } from "@/components/templates/dashboard-template"
import { DashboardContainer } from "@/components/organisms/dashboard-container"
import { DashboardCardData } from "@/components/molecules/dashboard-grid"
import { UserService } from "@/lib/services/profile/user.service"
import { useToast } from "@/hooks/use-toast"

export default function UnifiedDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
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
  let cards: DashboardCardData[] = []

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
        href: '/reports',
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
        href: '/reports',
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

  const handleRegisterGraduate = async (formData: any) => {
    try {
      const newUser = await UserService.create({
        ...formData,
        idIdentityDocumentType: parseInt(formData.idIdentityDocumentType),
      })
      toast({
        title: "Usuario registrado exitosamente",
        description: `El usuario ha sido registrado correctamente.`,
      })
      setShowRegisterModal(false)
      if (newUser?.id) {
        setTimeout(() => {
          router.replace(`/profile/${newUser.id}`)
        }, 200)
      }
    } catch (error) {
      toast({
        title: "Error al registrar usuario",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      })
    }
  }

  return (
    <DashboardTemplate
      user={{
        firstName,
        firstLastname,
        email,
        role,
        initials,
        ...userProfile
      }}
    >
      <DashboardContainer role={role} cards={cards} />
      
      {/* Modal para registrar egresado solo para admin */}
      {role === ROLES.ADMINISTRATIVE && (
        <RegisterGraduateModal open={showRegisterModal} onOpenChange={setShowRegisterModal} onSave={handleRegisterGraduate} />
      )}
    </DashboardTemplate>
  )
}

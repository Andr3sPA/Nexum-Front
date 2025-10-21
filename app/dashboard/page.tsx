"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ArrowRight,
  Users,
  BarChart3,
  FileText,
  Search,
  UserPlus,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { LocalStorageService } from "@/lib/services/local-storage.service";
import { ROLES } from "@/lib/services/constants/api.constants";
import RegisterGraduateModal from "@/components/organisms/modals/register-graduate-modal";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { DashboardContainer } from "@/components/organisms/dashboard-container";
import { DashboardCardData } from "@/components/molecules/dashboard-grid";
import { UserService } from "@/lib/services/profile/user.service";
import { toast } from "@/hooks/use-toast";
import { logger } from "@/lib/logging";

export default function UnifiedDashboardPage() {
  const router = useRouter();
  const user = LocalStorageService.getItem<{
    name?: string;
    email?: string;
    initials?: string;
    role?: string;
  }>("user");
  const userProfile = LocalStorageService.getItem<any>("userProfile");
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [router, user]);

  const firstName = userProfile?.name?.split(" ")[0] || "";
  const firstLastname = userProfile?.lastname?.split(" ")[0] || "";
  const email = user?.email || "";
  const initials =
    user?.initials || (firstName[0] || "") + (firstLastname[0] || "");
  const role = user?.role;

  // Opciones por rol
  let cards: DashboardCardData[] = [];

  if (role === ROLES.ADMINISTRATIVE || role === ROLES.ADMIN) {
    cards = [
      {
        href: "/search-graduates",
        icon: <Search className="w-8 h-8 text-blue-600" />,
        title: "Buscar Egresados",
        description:
          "Busca y filtra egresados por diferentes criterios como programa, año de graduación, ubicación, etc.",
        color: "blue",
      },
      {
        href: "/reports",
        icon: <FileText className="w-8 h-8 text-green-600" />,
        title: "Generar Reportes",
        description:
          "Genera reportes estadísticos de egresados por programa, género, años y exporta en Excel.",
        color: "green",
      },
      {
        href: "/admin/accounts",
        icon: <User className="w-8 h-8 text-orange-500" />,
        title: "Administrar Cuentas",
        description:
          "Gestiona cuentas de usuario, edita emails, contraseñas y roles de acceso.",
        color: "orange",
      },
      {
        href: "#register-graduate",
        icon: <UserPlus className="w-8 h-8 text-purple-600" />,
        title: "Registrar Egresado",
        description:
          "Registra un nuevo egresado en el sistema y completa su información de perfil.",
        color: "purple",
        onClick: () => setShowRegisterModal(true),
        isButton: true,
      },
      {
        href: "/opportunity",
        icon: <BarChart3 className="w-8 h-8 text-yellow-600" />,
        title: "Oportunidades",
        description: "Descubre nuevas oportunidades académicas y laborales",
        color: "yellow",

      },
      {
        href: "/opportunity?register=1",
        icon: <ArrowRight className="w-8 h-8 text-green-600" />,
        title: "Registrar Oportunidad",
        description:
          "Publica una nueva oportunidad laboral para egresados.",
        color: "green",
      },
    ];
  } else if (role === ROLES.DEAN) {
    cards = [
      {
        href: "/search-graduates",
        icon: <Users className="w-8 h-8 text-blue-600" />,
        title: "Buscar Egresados",
        description:
          "Consulta y filtra información de egresados por diferentes criterios académicos y profesionales.",
        color: "blue",
      },
      {
        href: "/reports",
        icon: <BarChart3 className="w-8 h-8 text-green-600" />,
        title: "Generar Reportes",
        description:
          "Genera reportes estadísticos detallados de egresados para análisis institucional.",
        color: "green",
      },
      {
        href: "/opportunity",
        icon: <BarChart3 className="w-8 h-8 text-yellow-600" />,
        title: "Oportunidades",
        description: "Descubre nuevas oportunidades académicas y laborales",
        color: "yellow",

      },
    ];
  } else if (role === ROLES.GRADUATE) {
    cards = [
      {
        href: "/profile",
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
        href: "/opportunity",
        icon: <BarChart3 className="w-8 h-8 text-yellow-600" />,
        title: "Oportunidades",
        description: "Descubre nuevas oportunidades académicas y laborales",
        color: "yellow",

      },
    ];
  } else if (role === ROLES.EMPLOYER) {
    cards = [
      {
        href: "/opportunity?register=1",
        icon: <ArrowRight className="w-8 h-8 text-green-600" />,
        title: "Registrar Oportunidad",
        description:
          "Publica una nueva oportunidad laboral para egresados.",
        color: "green",
      },
      {
        href: "/opportunity",
        icon: <BarChart3 className="w-8 h-8 text-yellow-600" />,
        title: "Ver Oportunidades",
        description:
          "Consulta las oportunidades laborales que has registrado en el sistema.",
        color: "yellow",
      },
    ];
  }

  const handleRegisterGraduate = async (formData: any) => {
    try {
      const userData = {
        ...formData,
        idIdentityDocumentType: parseInt(formData.idIdentityDocumentType),
      };

      const newUser = await UserService.create(userData);

      if (newUser?.id) {
        setShowRegisterModal(false);
        logger.info("Disparando toast de éxito");
        toast({
          title: "Usuario registrado exitosamente",
          description: `El usuario ha sido registrado correctamente.`,
          type: "success",
        });
        // Espera al menos 1.5 segundos para asegurar el render del toast antes de navegar
        setTimeout(() => {
          router.push(`${ROUTES.ADMIN.VIEW_PROFILE}?userId=${newUser.id}`);
        }, 1500);
      }
    } catch (error) {
      logger.error("❌ handleRegisterGraduate error:", error);
      setShowRegisterModal(false);
      toast({
        title: "Error al registrar usuario",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado.",
        type: "error",
      });
    }
  };

  return (
    <DashboardTemplate
      user={{
        firstName,
        firstLastname,
        email,
        role,
        initials,
        ...userProfile,
      }}
    >

      {/* Enlace para ver oportunidades para todos los roles */}
      <DashboardContainer role={role} cards={cards} />

      {/* Modal para registrar egresado solo para admin */}
      {role === ROLES.ADMINISTRATIVE && (
        <RegisterGraduateModal
          open={showRegisterModal}
          onOpenChange={setShowRegisterModal}
          onSave={handleRegisterGraduate}
        />
      )}
    </DashboardTemplate>
  );
}

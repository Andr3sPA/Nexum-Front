import React from "react"
import { cn } from "@/lib/utils"
import { ROLES } from "@/lib/services/constants/api.constants"

export interface WelcomeHeaderProps {
  role?: string
  className?: string
}

const roleDescriptions = {
  [ROLES.ADMINISTRATIVE]: "Gestiona la información de egresados y genera reportes",
  [ROLES.DEAN]: "Consulta información de egresados y genera reportes estadísticos",
  [ROLES.GRADUATE]: "Nos alegra tenerte de vuelta. Desde aquí puedes actualizar tu información personal, académica y laboral para mantenernos conectados contigo."
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ role, className }) => {
  return (
    <div className={cn("text-center", className)}>
      <h1 className="text-3xl font-bold udea-primary-text mb-4">
        ¡Bienvenido a la Plataforma de Egresados UdeA!
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        {role ? roleDescriptions[role as keyof typeof roleDescriptions] : "Accede a todas las funcionalidades de la plataforma"}
      </p>
    </div>
  )
} 
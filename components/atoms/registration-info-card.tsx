"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon, User, Calendar, CreditCard } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/molecules/card"

export interface RegistrationInfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  fullName: string
  birthDate: string
  idType: string
  idNumber: string
  color?: "blue" | "green" | "purple" | "orange"
}

const RegistrationInfoCard = React.forwardRef<HTMLDivElement, RegistrationInfoCardProps>(
  ({ className, fullName, birthDate, idType, idNumber, color = "blue", ...props }, ref) => {
    const getColorClasses = () => {
      switch (color) {
        case "green":
          return {
            border: "border-l-green-500",
            bg: "bg-green-100",
            icon: "text-green-600",
            title: "text-green-700"
          }
        case "blue":
          return {
            border: "border-l-blue-500",
            bg: "bg-blue-100",
            icon: "text-blue-600",
            title: "text-blue-700"
          }
        case "purple":
          return {
            border: "border-l-purple-500",
            bg: "bg-purple-100",
            icon: "text-purple-600",
            title: "text-purple-700"
          }
        case "orange":
          return {
            border: "border-l-orange-500",
            bg: "bg-orange-100",
            icon: "text-orange-600",
            title: "text-orange-700"
          }
        default:
          return {
            border: "border-l-blue-500",
            bg: "bg-blue-100",
            icon: "text-blue-600",
            title: "text-blue-700"
          }
      }
    }

    const colors = getColorClasses()

    return (
      <Card className={cn("border-l-4", colors.border)} ref={ref} {...props}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", colors.bg)}>
              <User className={cn("h-5 w-5", colors.icon)} />
            </div>
            <div>
              <CardTitle className={cn("text-lg", colors.title)}>
                Información de Registro
              </CardTitle>
              <p className="text-sm text-neutral-600">Datos personales básicos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <User className="h-4 w-4 text-neutral-500" />
              <div>
                <p className="text-xs text-neutral-500 font-medium">Nombre Completo</p>
                <p className="text-sm font-medium">{fullName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <Calendar className="h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Fecha de Nacimiento</p>
                  <p className="text-sm font-medium">{birthDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <CreditCard className="h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500 font-medium">Documento de Identidad</p>
                  <p className="text-sm font-medium">{idType} {idNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)
RegistrationInfoCard.displayName = "RegistrationInfoCard"

export { RegistrationInfoCard } 
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { MapPin, Mail, Phone, GraduationCap, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { Badge } from "@/components/atoms/badge"

export interface GraduateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  graduate: {
    id: string
    name: string
    middleName?: string
    lastname: string
    secondLastname?: string
    email?: string
    academicEmail?: string
    mobile?: string
    programs?: Array<{ name: string }>
    country?: string
    city?: string
    gender?: string
    role?: string
    graduationYear?: string
  }
  onViewProfile: (id: string) => void
}

// Función para mapear género a texto legible
const mapGenderToText = (gender?: string): string => {
  switch (gender) {
    case 'MALE':
      return 'Masculino'
    case 'FEMALE':
      return 'Femenino'
    case 'NON_BINARY':
      return 'No binario'
    case 'OTHER':
      return 'Otro'
    default:
      return 'No especificado'
  }
}

// Función para mapear rol a texto legible
const mapRoleToText = (role?: string): string => {
  switch (role) {
    case 'GRADUATE':
      return 'Egresado'
    case 'ADMINISTRATIVE':
      return 'Administrativo'
    case 'DEAN':
      return 'Decano'
    default:
      return 'No especificado'
  }
}

// Función para formatear ubicación
const formatLocation = (country?: string, city?: string): string => {
  if (!country && !city) return 'No especificado'
  if (country && city) return `${country} - ${city}`
  return country || city || 'No especificado'
}

const GraduateCard = React.forwardRef<HTMLDivElement, GraduateCardProps>(
  ({ 
    className, 
    graduate,
    onViewProfile,
    ...props 
  }, ref) => {
    const fullName = `${graduate.name} ${graduate.middleName || ''} ${graduate.lastname} ${graduate.secondLastname || ''}`.trim()
    const email = graduate.email || graduate.academicEmail
    const location = formatLocation(graduate.country, graduate.city)
    const genderText = mapGenderToText(graduate.gender)
    const roleText = mapRoleToText(graduate.role)

    return (
      <Card 
        className={cn(
          "border shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden",
          "hover:border-primary/20 hover:scale-[1.02]",
          className
        )} 
        ref={ref} 
        {...props}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold udea-primary-text group-hover:text-primary transition-colors">
                {fullName}
              </CardTitle>
              <CardDescription className="mt-1">
                {roleText} • {genderText}
                {graduate.graduationYear && ` • ${graduate.graduationYear}`}
              </CardDescription>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Información de contacto */}
          <div className="space-y-2">
            {email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 truncate">{email}</span>
              </div>
            )}
            {graduate.mobile && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">{graduate.mobile}</span>
              </div>
            )}
            {location !== 'No especificado' && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">{location}</span>
              </div>
            )}
          </div>

          {/* Programas como chips */}
          {graduate.programs && graduate.programs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <GraduationCap className="w-4 h-4" />
                Programas
              </div>
              <div className="flex flex-wrap gap-2">
                {graduate.programs.map((program, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    {program.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Botón de acción */}
          <div className="pt-3 border-t border-gray-100">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewProfile(graduate.id)}
              className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
            >
              Ver Perfil Completo
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
)
GraduateCard.displayName = "GraduateCard"

export { GraduateCard } 
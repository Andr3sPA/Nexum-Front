"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { Button } from "@/components/atoms/button"
import { Edit, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { ContactInformationResponse } from "@/lib/services/profile/contact-information.service"
import { InfoCard } from "@/components/atoms/info-card"
import { StatusBadge } from "@/components/atoms/status-badge"

interface ContactInformationCardProps {
  contactInfo: ContactInformationResponse
  onEdit?: () => void
}

export function ContactInformationCard({ 
  contactInfo, 
  onEdit 
}: ContactInformationCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "No disponible"
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-700">Información de Contacto</CardTitle>
              <p className="text-sm text-neutral-600">Datos de contacto y ubicación</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {contactInfo.current && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Actual
              </Badge>
            )}
            {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={MapPin}
            label="Dirección"
            value={contactInfo.address || "No disponible"}
          />
          
          <InfoCard
            icon={MapPin}
            label="País"
            value={contactInfo.country || "No disponible"}
          />
          
          <InfoCard
            icon={MapPin}
            label="Departamento"
            value={contactInfo.state || "No disponible"}
          />
          
          <InfoCard
            icon={MapPin}
            label="Ciudad"
            value={contactInfo.city || "No disponible"}
          />
          
          <InfoCard
            icon={Phone}
            label="Teléfono Fijo"
            value={contactInfo.landline || "No disponible"}
          />
          
          <InfoCard
            icon={Phone}
            label="Celular"
            value={contactInfo.mobile || "No disponible"}
          />
          
          <InfoCard
            icon={Mail}
            label="Correo Electrónico"
            value={contactInfo.email || "No disponible"}
          />
          
          <InfoCard
            icon={Mail}
            label="Correo Académico"
            value={contactInfo.academicEmail || "No disponible"}
          />
          
          <InfoCard
            icon={Phone}
            label="Autoriza WhatsApp"
            value={<StatusBadge status={contactInfo.whatsappAuthorization} />}
          />
        </div>
        
        <div className="pt-4 border-t mt-4">
          <p className="text-xs text-neutral-500">
            Última actualización: {formatDate(contactInfo.lastUpdate)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 
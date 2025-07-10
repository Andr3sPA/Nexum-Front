"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { ContactInformationResponse } from "@/lib/services/profile/contact-information.service"

interface ContactInformationCardProps {
  contactInfo: ContactInformationResponse
  onEdit: () => void
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Información de Contacto</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {contactInfo.current && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Actual
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Dirección</p>
            <p className="text-sm">{contactInfo.address || "No disponible"}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">País</p>
            <p className="text-sm">{contactInfo.country || "No disponible"}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Departamento</p>
            <p className="text-sm">{contactInfo.state || "No disponible"}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Ciudad</p>
            <p className="text-sm">{contactInfo.city || "No disponible"}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Teléfono Fijo</p>
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3 text-gray-400" />
              <p className="text-sm">{contactInfo.landline || "No disponible"}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Celular</p>
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3 text-gray-400" />
              <p className="text-sm">{contactInfo.mobile || "No disponible"}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3 text-gray-400" />
              <p className="text-sm">{contactInfo.email || "No disponible"}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Correo Académico</p>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3 text-gray-400" />
              <p className="text-sm">{contactInfo.academicEmail || "No disponible"}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Autoriza WhatsApp</p>
            <Badge variant={contactInfo.whatsappAuthorization ? "default" : "secondary"}>
              {contactInfo.whatsappAuthorization ? "Sí" : "No"}
            </Badge>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Última actualización: {formatDate(contactInfo.lastUpdate)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 
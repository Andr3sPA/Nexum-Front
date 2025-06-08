"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PersonalInfoModal from "../modals/personal-info-modal"

export default function PersonalInfoTab() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock registration data (read-only)
  const registrationData = {
    email: "usuario@udea.edu.co",
    idType: "Cédula de Ciudadanía",
    idNumber: "12345678",
    firstName: "Juan",
    secondName: "Carlos",
    firstLastName: "Pérez",
    secondLastName: "González",
    birthDate: "1990-05-15",
    gender: "Hombre",
  }

  // Mock additional personal data (editable) - Removed lastUpdateDate
  const [personalData, setPersonalData] = useState({
    maritalStatus: "",
    children: "",
    socioeconomicLevel: "",
    address: "",
    country: "",
    department: "",
    city: "",
    landlinePhone: "",
    cellPhone: "",
    whatsappNumber: "",
    email: "",
    whatsappAuthorization: "",
    graduationDate: "",
  })

  const handleSave = (data: typeof personalData) => {
    setPersonalData(data)
    setIsModalOpen(false)
    // TODO: Send data to backend with proper validation and sanitization
  }

  return (
    <div className="space-y-6">
      {/* Registration Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="udea-primary-text">Información de Registro</CardTitle>
          <p className="text-sm text-gray-600">Esta información no puede ser modificada</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
              <p className="text-gray-900">{registrationData.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tipo de Identificación</label>
              <p className="text-gray-900">{registrationData.idType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Número de Identificación</label>
              <p className="text-gray-900">{registrationData.idNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Primer Nombre</label>
              <p className="text-gray-900">{registrationData.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Segundo Nombre</label>
              <p className="text-gray-900">{registrationData.secondName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Primer Apellido</label>
              <p className="text-gray-900">{registrationData.firstLastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Segundo Apellido</label>
              <p className="text-gray-900">{registrationData.secondLastName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <p className="text-gray-900">{registrationData.birthDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Género</label>
              <p className="text-gray-900">{registrationData.gender}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Personal Information (Editable) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="udea-primary-text">Información Personal Adicional</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Estado Civil</label>
              <p className="text-gray-900">{personalData.maritalStatus || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Número de Hijos</label>
              <p className="text-gray-900">{personalData.children || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Estrato Socioeconómico</label>
              <p className="text-gray-900">{personalData.socioeconomicLevel || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Dirección</label>
              <p className="text-gray-900">{personalData.address || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">País</label>
              <p className="text-gray-900">{personalData.country || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Departamento</label>
              <p className="text-gray-900">{personalData.department || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Ciudad</label>
              <p className="text-gray-900">{personalData.city || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Teléfono Fijo</label>
              <p className="text-gray-900">{personalData.landlinePhone || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Número de Celular</label>
              <p className="text-gray-900">{personalData.cellPhone || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Número de Celular asociado con WhatsApp</label>
              <p className="text-gray-900">{personalData.whatsappNumber || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ¿Autoriza a ser parte de WhatsApp de la Universidad?
              </label>
              <p className="text-gray-900">{personalData.whatsappAuthorization || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Fecha de Egreso</label>
              <p className="text-gray-900">{personalData.graduationDate || "No hay datos"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PersonalInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={personalData}
      />
    </div>
  )
}

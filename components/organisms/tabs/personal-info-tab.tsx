"use client"

import { useState } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { DataField } from "@/components/atoms/data-field"
import { EditButton } from "@/components/atoms/edit-button"
import PersonalInfoModal from "@/components/organisms/modals/personal-info-modal"

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
  }

  // Mock additional personal data (editable)
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
    whatsapp: "",
    email: "",
    whatsappAuthorization: "",
    graduationDate: "",
    lastUpdateDate: "",
  })

  const handleSave = (data: typeof personalData) => {
    setPersonalData(data)
    setIsModalOpen(false)
    // TODO: Send data to backend
  }

  return (
    <div className="space-y-6">
      {/* Registration Information (Read-only) */}
      <DataSection title="Información de Registro" subtitle="Esta información no puede ser modificada">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Correo Electrónico" value={registrationData.email} />
          <DataField label="Tipo de Identificación" value={registrationData.idType} />
          <DataField label="Número de Identificación" value={registrationData.idNumber} />
          <DataField label="Primer Nombre" value={registrationData.firstName} />
          <DataField label="Segundo Nombre" value={registrationData.secondName || "N/A"} />
          <DataField label="Primer Apellido" value={registrationData.firstLastName} />
          <DataField label="Segundo Apellido" value={registrationData.secondLastName || "N/A"} />
          <DataField label="Fecha de Nacimiento" value={registrationData.birthDate} />
        </div>
      </DataSection>

      {/* Additional Personal Information (Editable) */}
      <DataSection title="Información Personal Adicional" action={<EditButton onClick={() => setIsModalOpen(true)} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Estado Civil" value={personalData.maritalStatus} />
          <DataField label="Número de Hijos" value={personalData.children} />
          <DataField label="Estrato Socioeconómico" value={personalData.socioeconomicLevel} />
          <DataField label="Dirección" value={personalData.address} />
          <DataField label="País" value={personalData.country} />
          <DataField label="Departamento" value={personalData.department} />
          <DataField label="Ciudad" value={personalData.city} />
          <DataField label="Teléfono Fijo" value={personalData.landlinePhone} />
          <DataField label="Celular" value={personalData.cellPhone} />
          <DataField label="WhatsApp" value={personalData.whatsapp} />
          <DataField label="Autoriza WhatsApp de la U" value={personalData.whatsappAuthorization} />
          <DataField label="Fecha de Egreso" value={personalData.graduationDate} />
          <DataField label="Fecha de Última Actualización" value={personalData.lastUpdateDate} />
        </div>
      </DataSection>

      <PersonalInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={personalData}
      />
    </div>
  )
}

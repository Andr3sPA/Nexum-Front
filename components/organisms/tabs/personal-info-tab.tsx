"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { DataField } from "@/components/atoms/data-field"
import { EditButton } from "@/components/atoms/edit-button"
import PersonalInfoModal from "@/components/organisms/modals/personal-info-modal"
import { LocalStorageService } from "@/lib/services/local-storage.service"
// import { DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"
// import { FamilyInformationService, FamilyInformationResponse } from "@/lib/services/profile/family-information.service"
// import { ContactInformationService, ContactInformationResponse } from "@/lib/services/profile/contact-information.service"
// import { logger } from "@/lib/logging"

// Temporary interfaces for testing
interface DetailedUserResponse {
  email?: string
  institutionalEmail?: string
  identityDocumentType?: { name: string }
  identityDocument?: string
  name?: string
  middleName?: string
  lastname?: string
  secondLastname?: string
  birthdate?: string
}

interface FamilyInformationResponse {
  id: number
  maritalState: string
  childNumber: number
  lastUpdate: string
}

interface ContactInformationResponse {
  id: number
  address: string
  country: string
  state: string
  city: string
  landline: string
  cellphone: string
  email: string
  authorizedWhatsapp: boolean
  graduationDate: string
  lastUpdate: string
}

// Match the exact interface from the modal
interface PersonalInfoData {
  maritalStatus: string
  children: string
  socioeconomicLevel: string
  address: string
  country: string
  department: string
  city: string
  landlinePhone: string
  cellPhone: string
  whatsapp: string
  email: string
  whatsappAuthorization: string
  graduationDate: string
  lastUpdateDate?: string
}

interface PersonalInfoTabProps {
  userProfile?: DetailedUserResponse & { email?: string };
}

export default function PersonalInfoTab({ userProfile }: PersonalInfoTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [familyInfo, setFamilyInfo] = useState<FamilyInformationResponse | null>(null)
  const [contactInfo, setContactInfo] = useState<ContactInformationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Get user from localStorage - memoized to prevent unnecessary re-renders
  const user = useMemo(() => {
    try {
      return LocalStorageService.getItem<any>("user")
    } catch (error) {
      console.error("Error getting user from localStorage:", error)
      return null
    }
  }, [])

  // Registration data from API (read-only) - memoized
  const registrationData = useMemo(() => ({
    email: userProfile?.email || userProfile?.institutionalEmail || "No disponible",
    idType: userProfile?.identityDocumentType?.name || "No disponible",
    idNumber: userProfile?.identityDocument || "No disponible",
    firstName: userProfile?.name || "No disponible",
    secondName: userProfile?.middleName || "N/A",
    firstLastName: userProfile?.lastname || "No disponible",
    secondLastName: userProfile?.secondLastname || "N/A",
    birthDate: userProfile?.birthdate || "No disponible",
  }), [userProfile])

  // Personal data from API (editable) - memoized and derived from family/contact info
  const personalData = useMemo(() => ({
    maritalStatus: familyInfo?.maritalState || "",
    children: familyInfo?.childNumber?.toString() || "",
    socioeconomicLevel: "", // Not available in API
    address: contactInfo?.address || "",
    country: contactInfo?.country || "",
    department: contactInfo?.state || "",
    city: contactInfo?.city || "",
    landlinePhone: contactInfo?.landline || "",
    cellPhone: contactInfo?.cellphone || "",
    whatsapp: "", // Not available in API
    email: contactInfo?.email || "",
    whatsappAuthorization: contactInfo?.authorizedWhatsapp ? "Sí" : "No",
    graduationDate: contactInfo?.graduationDate || "",
    lastUpdateDate: contactInfo?.lastUpdate || familyInfo?.lastUpdate,
  }), [familyInfo, contactInfo])

  // Fetch family and contact information - memoized callback
  const fetchData = useCallback(async () => {
    if (!user?.id || hasInitialized) return

    try {
      setIsLoading(true)
      setError(null)

      // Temporarily mock data for testing
      console.log("Fetching data for user:", user.id)
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock family data
      setFamilyInfo({
        id: 1,
        maritalState: "SINGLE",
        childNumber: 0,
        lastUpdate: new Date().toISOString()
      })
      
      // Mock contact data
      setContactInfo({
        id: 1,
        address: "Calle 123",
        country: "Colombia",
        state: "Antioquia",
        city: "Medellín",
        landline: "1234567",
        cellphone: "3001234567",
        email: "test@example.com",
        authorizedWhatsapp: true,
        graduationDate: "2023-12-01",
        lastUpdate: new Date().toISOString()
      })

      setHasInitialized(true)
    } catch (error) {
      console.error("Error fetching personal information:", error)
      setError("Error al cargar la información personal")
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, hasInitialized])

  // Fetch data only once on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Optimized save handler - memoized callback
  const handleSave = useCallback(async (data: PersonalInfoData) => {
    if (!user?.id) {
      setError("No se pudo identificar al usuario")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Temporarily mock save operation
      console.log("Saving data:", data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update state with new data
      setFamilyInfo({
        id: 1,
        maritalState: data.maritalStatus as any,
        childNumber: parseInt(data.children) || 0,
        lastUpdate: new Date().toISOString()
      })
      
      setContactInfo({
        id: 1,
        address: data.address,
        country: data.country,
        state: data.department,
        city: data.city,
        landline: data.landlinePhone,
        cellphone: data.cellPhone,
        email: data.email,
        authorizedWhatsapp: data.whatsappAuthorization === "Sí",
        graduationDate: data.graduationDate,
        lastUpdate: new Date().toISOString()
      })
      
      setIsModalOpen(false)

    } catch (error) {
      console.error("Error saving personal information:", error)
      setError("Error al guardar la información personal")
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // Memoized modal close handler
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  // Memoized modal open handler
  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  if (isLoading && !hasInitialized) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-red-600 text-lg mb-2">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null)
              setHasInitialized(false)
              fetchData()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
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
      <DataSection title="Información Personal Adicional" action={<EditButton onClick={handleModalOpen} />}>
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
          <DataField label="Fecha de Última Actualización" value={personalData.lastUpdateDate || "No disponible"} />
        </div>
      </DataSection>

      <PersonalInfoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        initialData={personalData}
      />
    </div>
  )
}
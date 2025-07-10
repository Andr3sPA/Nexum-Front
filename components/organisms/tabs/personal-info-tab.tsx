"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { DataSection } from "@/components/organisms/data-section"
import { DataField } from "@/components/atoms/data-field"
import { EditButton } from "@/components/atoms/edit-button"
import { SectionTitle } from "@/components/atoms/section-title"
import { ContactInformationModal } from "@/components/organisms/modals/contact-information-modal"
import { FamilyInformationModal } from "@/components/organisms/modals/family-information-modal"
import { ContactInformationCard } from "@/components/molecules/contact-information-card"
import { FamilyInformationCard } from "@/components/molecules/family-information-card"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { ContactInformationResponse, ContactInformationService, ContactInformationRequest } from "@/lib/services/profile/contact-information.service"
import { FamilyInformationResponse, FamilyInformationService, FamilyInformationRequest } from "@/lib/services/profile/family-information.service"
import { logger } from "@/lib/logging"

interface PersonalInfoTabProps {
  userProfile?: any;
}

export default function PersonalInfoTab({ userProfile }: PersonalInfoTabProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [familyInfo, setFamilyInfo] = useState<FamilyInformationResponse | null>(null)
  const [contactInfo, setContactInfo] = useState<ContactInformationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Get user from localStorage
  const user = useMemo(() => {
    try {
      return LocalStorageService.getItem<any>("user")
    } catch (error) {
      console.error("Error getting user from localStorage:", error)
      return null
    }
  }, [])

  // Get user profile from localStorage
  const userProfileData = useMemo(() => {
    try {
      return LocalStorageService.getItem<any>("userProfile")
    } catch (error) {
      console.error("Error getting userProfile from localStorage:", error)
      return null
    }
  }, [])

  // Registration data from localStorage - memoized
  const registrationData = useMemo(() => ({
    email: userProfileData?.email || userProfileData?.institutionalEmail || "No disponible",
    idType: userProfileData?.identityDocumentType?.name || "No disponible",
    idNumber: userProfileData?.identityDocument || "No disponible",
    firstName: userProfileData?.name || "No disponible",
    secondName: userProfileData?.middleName || "N/A",
    firstLastName: userProfileData?.lastname || "No disponible",
    secondLastName: userProfileData?.secondLastname || "N/A",
    birthDate: userProfileData?.birthdate || "No disponible",
  }), [userProfileData])

  // Fetch family and contact information - memoized callback
  const fetchData = useCallback(async () => {
    if (!userProfileData?.id || hasInitialized) return

    try {
      setIsLoading(true)
      setError(null)

      console.log("Loading data from userProfile:", userProfileData.id)
      
      // Get contact information from userProfile
      if (userProfileData.contactInformation) {
        setContactInfo(userProfileData.contactInformation)
      } else {
        setContactInfo(null)
      }

      // Get family information from userProfile
      if (userProfileData.familyInformation) {
        setFamilyInfo(userProfileData.familyInformation)
      } else {
        setFamilyInfo(null)
      }

      setHasInitialized(true)
    } catch (error) {
      console.error("Error loading personal information:", error)
      setError("Error al cargar la información personal")
    } finally {
      setIsLoading(false)
    }
  }, [userProfileData, hasInitialized])

  // Fetch data only once on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Contact information handlers
  const handleContactSave = useCallback(async (formData: any) => {
    if (!userProfileData?.id) {
      setError("No se pudo identificar al usuario")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const contactRequest: ContactInformationRequest = {
        userId: userProfileData.id,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        landline: formData.landline,
        mobile: formData.cellphone,
        email: formData.email,
        academicEmail: formData.academicEmail,
        whatsappAuthorization: formData.whatsappAuthorization,
        isCurrent: true
      }
      console.log("Contact request:", contactRequest)

      let savedContactInfo: ContactInformationResponse

      if (contactInfo) {
        // Update existing contact information
        savedContactInfo = await ContactInformationService.updateById(contactInfo.id, contactRequest)
      } else {
        // Create new contact information
        savedContactInfo = await ContactInformationService.create(contactRequest)
      }

      setContactInfo(savedContactInfo)
      
      // Update localStorage userProfile with new contact information
      const updatedUserProfile = {
        ...userProfileData,
        contactInformation: savedContactInfo
      }
      LocalStorageService.setItem("userProfile", updatedUserProfile)
      
      setIsContactModalOpen(false)
      
      logger.info("Contact information saved successfully")
    } catch (error) {
      console.error("Error saving contact information:", error)
      setError("Error al guardar la información de contacto")
    } finally {
      setIsLoading(false)
    }
  }, [userProfileData, contactInfo])

  const handleEditContact = () => {
    setIsContactModalOpen(true)
  }

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false)
  }

  // Family information handlers
  const handleFamilySave = useCallback(async (formData: any) => {
    if (!userProfileData?.id) {
      setError("No se pudo identificar al usuario")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const familyRequest: FamilyInformationRequest = {
        userId: userProfileData.id,
        maritalState: formData.maritalState,
        childNumber: formData.childNumber
      }

      let savedFamilyInfo: FamilyInformationResponse

      if (familyInfo) {
        // Update existing family information
        savedFamilyInfo = await FamilyInformationService.updateById(familyInfo.id, familyRequest)
      } else {
        // Create new family information
        savedFamilyInfo = await FamilyInformationService.create(familyRequest)
      }

      setFamilyInfo(savedFamilyInfo)
      
      // Update localStorage userProfile with new family information
      const updatedUserProfile = {
        ...userProfileData,
        familyInformation: savedFamilyInfo
      }
      LocalStorageService.setItem("userProfile", updatedUserProfile)
      
      setIsFamilyModalOpen(false)
      
      logger.info("Family information saved successfully")
    } catch (error) {
      console.error("Error saving family information:", error)
      setError("Error al guardar la información familiar")
    } finally {
      setIsLoading(false)
    }
  }, [userProfileData, familyInfo])

  const handleEditFamily = () => {
    setIsFamilyModalOpen(true)
  }

  const handleCloseFamilyModal = () => {
    setIsFamilyModalOpen(false)
  }

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

      {/* Contact Information Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <SectionTitle>Información de Contacto</SectionTitle>
          <EditButton onClick={handleEditContact} />
        </div>
        
        {contactInfo ? (
          <ContactInformationCard
            contactInfo={contactInfo}
            onEdit={handleEditContact}
          />
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No hay información de contacto registrada</p>
          </div>
        )}
      </div>

      {/* Family Information Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <SectionTitle>Información Familiar</SectionTitle>
          <EditButton onClick={handleEditFamily} />
        </div>
        
        {familyInfo ? (
          <FamilyInformationCard
            familyInfo={familyInfo}
            onEdit={handleEditFamily}
          />
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No hay información familiar registrada</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ContactInformationModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        onSave={handleContactSave}
        contactData={contactInfo}
      />

      <FamilyInformationModal
        isOpen={isFamilyModalOpen}
        onClose={handleCloseFamilyModal}
        onSave={handleFamilySave}
        familyData={familyInfo}
      />
    </div>
  )
}
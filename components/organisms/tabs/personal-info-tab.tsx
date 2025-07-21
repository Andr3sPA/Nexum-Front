"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { TabContainer, TabSection, TabDataField } from "@/components/organisms/tab-container"
import { ContactInformationModal } from "@/components/organisms/modals/contact-information-modal"
import { FamilyInformationModal } from "@/components/organisms/modals/family-information-modal"
import { ContactInformationCard } from "@/components/molecules/contact-information-card"
import { FamilyInformationCard } from "@/components/molecules/family-information-card"
import { RegistrationInfoCard } from "@/components/atoms/registration-info-card"
import { EmptyStateCard } from "@/components/atoms/empty-state-card"
import { AddButton } from "@/components/atoms/add-button"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { ContactInformationResponse, ContactInformationService, ContactInformationRequest } from "@/lib/services/profile/contact-information.service"
import { FamilyInformationResponse, FamilyInformationService, FamilyInformationRequest } from "@/lib/services/profile/family-information.service"
import { logger } from "@/lib/logging"
import { MapPin, Users } from "lucide-react"

interface PersonalInfoTabProps {
  userProfile?: any;
  isViewOnly?: boolean;
  onDataUpdate?: () => Promise<void>;
}

export default function PersonalInfoTab({ userProfile, isViewOnly = false, onDataUpdate }: PersonalInfoTabProps) {
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
      logger.error("Error getting user from localStorage:", error)
      return null
    }
  }, [])

  // Use userProfile from props (backend data) or fallback to localStorage
  const userProfileData = useMemo(() => {
    // If userProfile is provided (from backend), use it
    if (userProfile) {
      return userProfile
    }
    // Otherwise, fallback to localStorage (for current user)
    try {
      return LocalStorageService.getItem<any>("userProfile")
    } catch (error) {
      logger.error("Error getting userProfile from localStorage:", error)
      return null
    }
  }, [userProfile])

  // Registration data from userProfile - memoized
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

      // Get contact information from userProfile (backend data)
      if (userProfileData.contactInformation) {
        setContactInfo(userProfileData.contactInformation)
      } else {
        setContactInfo(null)
      }

      // Get family information from userProfile (backend data)
      if (userProfileData.familyInformation) {
        setFamilyInfo(userProfileData.familyInformation)
      } else {
        setFamilyInfo(null)
      }

      setHasInitialized(true)
    } catch (error) {
      logger.error("Error loading personal information:", error)
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
        mobile: formData.mobile,
        email: formData.email,
        academicEmail: formData.academicEmail,
        whatsappAuthorization: formData.whatsappAuthorization,
        current: true
      }

      let savedContactInfo: ContactInformationResponse

      if (contactInfo) {
        // Update existing contact information
        savedContactInfo = await ContactInformationService.updateById(contactInfo.id, contactRequest)
      } else {
        // Create new contact information
        savedContactInfo = await ContactInformationService.create(contactRequest)
      }

      setContactInfo(savedContactInfo)
      
      // Update localStorage userProfile with new contact information (only for current user)
      // We don't need to update localStorage anymore since we always get data from backend
      // The onDataUpdate callback will refresh the data from the backend
      
      // Call onDataUpdate to refresh the parent component
      if (onDataUpdate) {
        await onDataUpdate()
      }
      
      setIsContactModalOpen(false)
      
      logger.info("Contact information saved successfully")
    } catch (error) {
      logger.error("Error saving contact information:", error)
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
      
      // Update localStorage userProfile with new family information (only for current user)
      // We don't need to update localStorage anymore since we always get data from backend
      // The onDataUpdate callback will refresh the data from the backend
      
      // Call onDataUpdate to refresh the parent component
      if (onDataUpdate) {
        await onDataUpdate()
      }
      
      setIsFamilyModalOpen(false)
      
      logger.info("Family information saved successfully")
    } catch (error) {
      logger.error("Error saving family information:", error)
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

  return (
    <TabContainer 
      title="Información Personal"
      isLoading={isLoading}
      error={error}
    >
      {/* Registration Information Section */}
      <TabSection title="" showEditButton={false}>
        <RegistrationInfoCard
          fullName={`${registrationData.firstName}${registrationData.secondName ? ` ${registrationData.secondName}` : ''} ${registrationData.firstLastName}${registrationData.secondLastName ? ` ${registrationData.secondLastName}` : ''}`}
          birthDate={registrationData.birthDate}
          idType={registrationData.idType}
          idNumber={registrationData.idNumber}
          color="blue"
        />
      </TabSection>

      {/* Contact Information Section */}
      <TabSection title="" showEditButton={false}>
        {contactInfo ? (
          <ContactInformationCard 
            contactInfo={contactInfo} 
            onEdit={isViewOnly ? undefined : handleEditContact} 
          />
        ) : (
          <EmptyStateCard
            icon={MapPin}
            title="Información de Contacto"
            description="No hay información de contacto registrada"
            actionText={isViewOnly ? undefined : "Añadir Información de Contacto"}
            onAction={isViewOnly ? undefined : handleEditContact}
            color="blue"
          />
        )}
      </TabSection>

      {/* Family Information Section */}
      <TabSection title="" showEditButton={false}>
        {familyInfo ? (
          <FamilyInformationCard 
            familyInfo={familyInfo} 
            onEdit={isViewOnly ? undefined : handleEditFamily} 
          />
        ) : (
          <EmptyStateCard
            icon={Users}
            title="Información Familiar"
            description="No hay información familiar registrada"
            actionText={isViewOnly ? undefined : "Añadir Información Familiar"}
            onAction={isViewOnly ? undefined : handleEditFamily}
            color="purple"
          />
        )}
      </TabSection>

      <ContactInformationModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        onSave={(formData, userId) => handleContactSave({ ...formData, userId })}
        contactData={contactInfo}
        userId={userProfileData?.id || ""}
      />

      <FamilyInformationModal
        isOpen={isFamilyModalOpen}
        onClose={handleCloseFamilyModal}
        onSave={(formData, userId) => handleFamilySave({ ...formData, userId })}
        familyData={familyInfo}
        userId={userProfileData?.id || ""}
      />
    </TabContainer>
  )
}
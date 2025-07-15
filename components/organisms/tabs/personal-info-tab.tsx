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
        mobile: formData.mobile,
        email: formData.email,
        academicEmail: formData.academicEmail,
        whatsappAuthorization: formData.whatsappAuthorization,
        current: true
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
          <ContactInformationCard contactInfo={contactInfo} onEdit={handleEditContact} />
        ) : (
          <EmptyStateCard
            icon={MapPin}
            title="Información de Contacto"
            description="No hay información de contacto registrada"
            actionText="Añadir Información de Contacto"
            onAction={handleEditContact}
            color="blue"
          />
        )}
      </TabSection>

      {/* Family Information Section */}
      <TabSection title="" showEditButton={false}>
        {familyInfo ? (
          <FamilyInformationCard familyInfo={familyInfo} onEdit={handleEditFamily} />
        ) : (
          <EmptyStateCard
            icon={Users}
            title="Información Familiar"
            description="No hay información familiar registrada"
            actionText="Añadir Información Familiar"
            onAction={handleEditFamily}
            color="purple"
          />
        )}
      </TabSection>

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
    </TabContainer>
  )
}
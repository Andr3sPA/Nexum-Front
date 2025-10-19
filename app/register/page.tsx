"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { RegisterForm, RegisterFormData, EmployerFormData } from "@/components/organisms/register-form"
import AuthTemplate from "@/components/templates/auth-template"
import { AuthenticationService } from "@/lib/services/profile/auth.service"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { DetailedUserService } from "@/lib/services/profile/detailed-user.service"
import { EmployerService } from "@/lib/services/profile/employer.service"
import { logger } from "@/lib/logging"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEmployerRegistration = searchParams.get("employer") === "1"

  // Extract employer registration parameters
  const employerParams = isEmployerRegistration ? {
    contactName: searchParams.get("contactName") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
    businessName: searchParams.get("businessName") || "",
    nit: searchParams.get("nit") || "",
    editCode: searchParams.get("editCode") || undefined
  } : undefined



  const handleSubmit = useCallback(async (formData: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {

      await AuthenticationService.register({
        identityDocument: formData.idNumber,
        idIdentityDocumentType: parseInt(formData.idType) || 1,
        name: formData.firstName,
        middleName: formData.secondName,
        lastname: formData.firstLastName,
        secondLastname: formData.secondLastName,
        birthdate: formData.birthDate,
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
      })

  // After registering, redirect user to verification page so they can enter code sent by email
        router.push("/verify?email=" + encodeURIComponent(formData.email))
    } catch (err: any) {
      setError(err.message || "Error al registrarse")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleEmployerSubmit = useCallback(async (formData: EmployerFormData, editCode?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Register the employer
      await AuthenticationService.registerEmployer({
        name: formData.contactName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        businessName: formData.businessName,
        nit: formData.nit,
        editCode: editCode,
      })

      // Automatically login the newly registered employer
      const loginResponse = await AuthenticationService.login({
        email: formData.email,
        password: formData.password,
      })

      // Store user in localStorage
      LocalStorageService.setItem("user", loginResponse)

      // Try to get detailed user profile
      try {
        const userProfile = await DetailedUserService.getCurrentUserDetailed()
        LocalStorageService.setItem("userProfile", userProfile)
      } catch (profileErr) {
        logger.warn("Could not get detailed user profile:", profileErr)
      }

      // Try to get employer profile
      try {
        const employerProfile = await EmployerService.getCurrentEmployer()
        LocalStorageService.setItem("employerProfile", employerProfile)
      } catch (employerErr) {
        logger.warn("Could not get employer profile:", employerErr)
        // If we can't fetch employer profile, create it from registration data
        const employerProfile = {
          id: loginResponse.id,
          name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          businessName: formData.businessName,
          nit: formData.nit,
          creationDate: new Date().toISOString(),
          lastUpdate: new Date().toISOString()
        };
        LocalStorageService.setItem("employerProfile", employerProfile)
      }

      // Redirect to dashboard
      router.replace("/dashboard")

    } catch (err: any) {
      logger.error("Employer registration error:", err)
      setError(err.message || "Error al registrar empleador")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return (
    <AuthTemplate variant="register">
      <RegisterForm
        onSubmit={handleSubmit}
        onEmployerSubmit={handleEmployerSubmit}
        error={error}
        isLoading={isLoading}
        showLoginLink={true}
        loginLinkHref="/login"
        loginLinkText="Inicia sesión aquí"
        isEmployer={isEmployerRegistration}
        initialEmployerData={employerParams}
      />
    </AuthTemplate>
  )
}

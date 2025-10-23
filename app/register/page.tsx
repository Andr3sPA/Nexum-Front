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
      logger.info("🔄 Starting employer registration", { formData, editCode })

      // Register the employer
      const registerBody = await AuthenticationService.registerEmployer({
        name: formData.contactName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        businessName: formData.businessName || undefined,
        nit: formData.nit || undefined,
        editCode: editCode,
      })

      logger.info("✅ Employer registration successful", registerBody)

      // After registering, redirect user to verification page so they can enter code sent by email
      router.push("/verify?email=" + encodeURIComponent(formData.email))
      logger.info("✅ Redirected to verification page")

    } catch (err: any) {
      logger.error("❌ Employer registration error:", err)
      const errorMessage = err.message || err?.response?.data?.message || "Error al registrar empleador"
      setError(errorMessage)
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

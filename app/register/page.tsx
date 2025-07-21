"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { RegisterForm, RegisterFormData } from "@/components/organisms/register-form"
import RegisterTemplate from "@/components/templates/register-template"
import { AuthenticationService } from "@/lib/services/profile/auth.service"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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

      router.push("/login?success=1")
    } catch (err: any) {
      setError(err.message || "Error al registrarse")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return (
    <RegisterTemplate>
      <RegisterForm
        onSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
        showLoginLink={true}
        loginLinkHref="/login"
        loginLinkText="Inicia sesión aquí"
      />
    </RegisterTemplate>
  )
}

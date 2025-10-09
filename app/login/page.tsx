"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/organisms/login-form"
import EmployerRegistrationForm from "@/components/organisms/employer-registration-form"
import AuthTemplate from "@/components/templates/auth-template"
import { Button } from "@/components/atoms/button"
import { AuthenticationService } from "@/lib/services/profile/auth.service"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { DetailedUserService } from "@/lib/services/profile/detailed-user.service"
import { EmployerService } from "@/lib/services/profile/employer.service"
import { logger } from "@/lib/logging"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get("success") === "1" ? "¡Registro exitoso! Ahora puedes iniciar sesión." : null
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

  // Validate required parameters for employer registration
  const hasRequiredParams = isEmployerRegistration && employerParams &&
    (employerParams.contactName || employerParams.email || employerParams.editCode)

  const handleSubmit = useCallback(async (formData: { email: string; password: string }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      
      const user = await AuthenticationService.login(formData)

      LocalStorageService.setItem("user", user)

      // Try to get detailed user profile (for graduates)
      try {
        const userProfile = await DetailedUserService.getCurrentUserDetailed()
        LocalStorageService.setItem("userProfile", userProfile)
      } catch (profileErr) {
        logger.warn("⚠️ No se pudo obtener el perfil detallado:", profileErr)
      }

      // Try to get employer profile (for employers)
      try {
        const employerProfile = await EmployerService.getCurrentEmployer()
        LocalStorageService.setItem("employerProfile", employerProfile)
      } catch (employerErr) {
        logger.warn("⚠️ No se pudo obtener el perfil de empleador:", employerErr)
      }

      await router.replace("/dashboard")
    } catch (err: any) {
      logger.error("❌ Login error:", err)
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleEmployerRegistrationSuccess = () => {
    router.replace("/dashboard")
  }

  const handleEmployerRegistrationCancel = () => {
    router.replace("/login")
  }

  return (
    <AuthTemplate variant="login">
      {isEmployerRegistration && hasRequiredParams ? (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completa tu registro como empleador
            </h2>
            <p className="text-gray-600">
              Para publicar tu oportunidad laboral, necesitamos que crees una cuenta de empleador.
            </p>
          </div>
          <EmployerRegistrationForm
            initialData={employerParams}
            editCode={employerParams.editCode}
            onSuccess={handleEmployerRegistrationSuccess}
            onCancel={handleEmployerRegistrationCancel}
          />
        </div>
      ) : isEmployerRegistration ? (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error en el enlace de registro
            </h2>
            <p className="text-gray-600 mb-4">
              El enlace para registro de empleador no contiene la información necesaria.
            </p>
            <Button onClick={() => router.replace("/login")} variant="outline">
              Ir al inicio de sesión
            </Button>
          </div>
        </div>
      ) : (
        <LoginForm
          onSubmit={handleSubmit}
          error={error}
          success={success}
          isLoading={isLoading}
          showRegisterLink={true}
          registerLinkHref="/register"
          registerLinkText="Regístrate aquí"
        />
      )}
    </AuthTemplate>
  )
}

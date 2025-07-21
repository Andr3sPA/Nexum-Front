"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/organisms/login-form"
import AuthTemplate from "@/components/templates/auth-template"
import { AuthenticationService } from "@/lib/services/profile/auth.service"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { DetailedUserService } from "@/lib/services/profile/detailed-user.service"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get("success") === "1" ? "¡Registro exitoso! Ahora puedes iniciar sesión." : null

  const handleSubmit = useCallback(async (formData: { email: string; password: string }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("🔐 Login attempt with data:", { email: formData.email, password: "***" })
      
      const user = await AuthenticationService.login(formData)

      LocalStorageService.setItem("user", user)
      
      try {
        const userProfile = await DetailedUserService.getCurrentUserDetailed()
        LocalStorageService.setItem("userProfile", userProfile)
      } catch (profileErr) {
        console.warn("⚠️ No se pudo obtener el perfil detallado:", profileErr)
      }

      await router.replace("/dashboard")
    } catch (err: any) {
      console.error("❌ Login error:", err)
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return (
    <AuthTemplate variant="login">
      <LoginForm
        onSubmit={handleSubmit}
        error={error}
        success={success}
        isLoading={isLoading}
        showRegisterLink={true}
        registerLinkHref="/register"
        registerLinkText="Regístrate aquí"
      />
    </AuthTemplate>
  )
}

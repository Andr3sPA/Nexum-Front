"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import AuthTemplate from "@/components/templates/auth-template"
import { AuthenticationService } from "@/lib/services/profile/auth.service"
import { useSearchParams } from "next/navigation"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { ROLES } from "@/lib/services/constants/api.constants"
import { DetailedUserService } from "@/lib/services/profile/detailed-user.service"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get("success") === "1"

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Form submitted, starting login...")
    setError(null)
    try {
      
      const user = await AuthenticationService.login({ email, password })

      LocalStorageService.setItem("user", user)
      try {
        const userProfile = await DetailedUserService.getCurrentUserDetailed()
        LocalStorageService.setItem("userProfile", userProfile)
      } catch (profileErr) {
        console.warn("No se pudo obtener el perfil detallado:", profileErr)
      }

      // Siempre redirigir al dashboard principal
      await router.replace("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Error al iniciar sesión")
    }
  }, [email, password, router])

  return (
    <AuthTemplate>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center udea-primary-text">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="text-green-600 text-sm text-center mb-2">
              ¡Registro exitoso! Ahora puedes iniciar sesión.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full udea-primary">
              Iniciar Sesión
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="udea-primary-text hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthTemplate>
  )
}

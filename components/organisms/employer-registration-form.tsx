"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/molecules/card"
import { Building, User, Mail, Phone, Lock, CheckCircle } from "lucide-react"
import { AuthenticationService } from "@/lib/services/profile/auth.service"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { DetailedUserService } from "@/lib/services/profile/detailed-user.service"
import { EmployerService } from "@/lib/services/profile/employer.service"
import { AuthenticatedUserResponse, DetailedUserResponse } from "@/lib/services/profile"
import { logger } from "@/lib/logging"

interface EmployerRegistrationFormProps {
  initialData?: {
    contactName?: string
    email?: string
    phone?: string
    businessName?: string
    nit?: string
  }
  editCode?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function EmployerRegistrationForm({
  initialData = {},
  editCode,
  onSuccess,
  onCancel
}: EmployerRegistrationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    contactName: initialData.contactName || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    businessName: initialData.businessName || "",
    nit: initialData.nit || "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

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

      // Call success callback or redirect to dashboard
      if (onSuccess) {
        onSuccess()
      } else {
        router.replace("/dashboard")
      }

    } catch (err: any) {
      logger.error("Employer registration error:", err)
      setError(err.message || "Error al registrar empleador")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.contactName && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <Building className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Registro de Empleador
        </CardTitle>
        <CardDescription>
          Crea tu cuenta de empleador para gestionar oportunidades laborales
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="contactName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nombre de Contacto *
              </Label>
              <Input
                id="contactName"
                name="contactName"
                type="text"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Correo Electrónico *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+57 300 123 4567"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="businessName" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Nombre de la Empresa
              </Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Nombre de tu empresa"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="nit">NIT</Label>
              <Input
                id="nit"
                name="nit"
                type="text"
                value={formData.nit}
                onChange={handleChange}
                placeholder="Número de Identificación Tributaria"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Contraseña *
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una contraseña segura"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Confirmar Contraseña *
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu contraseña"
                required
                className="mt-1"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registrando...
                </>
              ) : (
                "Crear Cuenta de Empleador"
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="w-full"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
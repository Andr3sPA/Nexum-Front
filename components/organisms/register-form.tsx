"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Select } from "@/components/atoms/select"
import { FormField } from "@/components/molecules/form-field"
import { Alert, AlertDescription } from "@/components/atoms/alert"
import { NexumLogo } from "@/components/molecules/nexum-logo"
import { Eye, EyeOff, Mail, Lock, User, Calendar, CreditCard, Users } from "lucide-react"
import { IdentityDocumentTypeService, IdentityDocumentTypeResponse } from "@/lib/services/catalog/identity-document-type.service"
import { logger } from "@/lib/logging"

export interface RegisterFormData {
  email: string
  idType: string
  idNumber: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  birthDate: string
  gender: string
  password: string
  confirmPassword: string
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  error?: string | null
  isLoading?: boolean
  showLoginLink?: boolean
  loginLinkHref?: string
  loginLinkText?: string
}

export function RegisterForm({
  onSubmit,
  error,
  isLoading = false,
  showLoginLink = true,
  loginLinkHref = "/login",
  loginLinkText = "Inicia sesión aquí"
}: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    idType: "",
    idNumber: "",
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    birthDate: "",
    gender: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [documentTypes, setDocumentTypes] = useState<IdentityDocumentTypeResponse[]>([])

  useEffect(() => {
    IdentityDocumentTypeService.getAll()
      .then(setDocumentTypes)
      .catch(() => setDocumentTypes([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      logger.error("❌ Passwords don't match")
      return
    }
    
    try {
      await onSubmit(formData)
      logger.info("✅ RegisterForm.handleSubmit completed successfully")
    } catch (error) {
      logger.error("❌ RegisterForm.handleSubmit error:", error)
    }
  }

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-3">
          <NexumLogo size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
        <p className="text-gray-600 text-sm">
          Completa la información para crear tu cuenta como egresado
        </p>
      </div>

      {/* Login Link */}
      {showLoginLink && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <a 
              href={loginLinkHref} 
              className="font-medium text-[#026937] hover:text-[#35944b] transition-colors duration-200 hover:underline"
            >
              {loginLinkText}
            </a>
          </p>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Information Section */}
        <div className="space-y-3">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-base font-semibold text-gray-900">Información de Cuenta</h2>
          </div>
          
          <div className="space-y-3">
            {/* Email - Full Width */}
            <FormField id="email" label="Correo Electrónico" required>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="tu@correo.com"
                  className="pl-10 h-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </FormField>

            {/* Passwords - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <FormField id="password" label="Contraseña" required>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormField>

              <FormField id="confirmPassword" label="Confirmar" required>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </FormField>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="space-y-3">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-base font-semibold text-gray-900">Información Personal</h2>
          </div>
          
          <div className="space-y-3">
            {/* Identification - Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField id="idType" label="Tipo ID" required>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Select 
                    value={formData.idType} 
                    onChange={(e) => handleInputChange("idType", e.target.value)}
                    className="pl-10 h-10"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar</option>
                    {documentTypes.map((type) => (
                      <option key={type.id} value={String(type.id)}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </FormField>

              <FormField id="idNumber" label="Número ID" required>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  placeholder="12345678"
                  className="h-10"
                  required
                  disabled={isLoading}
                />
              </FormField>
            </div>

            {/* Names - Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <FormField id="firstName" label="Primer Nombre" required>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Juan"
                    className="pl-10 h-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </FormField>

              <FormField id="secondName" label="Segundo Nombre">
                <Input
                  id="secondName"
                  value={formData.secondName}
                  onChange={(e) => handleInputChange("secondName", e.target.value)}
                  placeholder="Carlos"
                  className="h-10"
                  disabled={isLoading}
                />
              </FormField>

              <FormField id="firstLastName" label="Primer Apellido" required>
                <Input
                  id="firstLastName"
                  value={formData.firstLastName}
                  onChange={(e) => handleInputChange("firstLastName", e.target.value)}
                  placeholder="Pérez"
                  className="h-10"
                  required
                  disabled={isLoading}
                />
              </FormField>

              <FormField id="secondLastName" label="Segundo Apellido">
                <Input
                  id="secondLastName"
                  value={formData.secondLastName}
                  onChange={(e) => handleInputChange("secondLastName", e.target.value)}
                  placeholder="García"
                  className="h-10"
                  disabled={isLoading}
                />
              </FormField>
            </div>

            {/* Birth and Gender - Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField id="birthDate" label="Fecha Nacimiento" required>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="pl-10 h-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </FormField>

              <FormField id="gender" label="Género" required>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Select 
                    value={formData.gender} 
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="pl-10 h-10"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="No binario">No binario</option>
                    <option value="Otro">Otro</option>
                  </Select>
                </div>
              </FormField>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isLoading}
          onClick={() => logger.info("🔘 Register button clicked")}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creando cuenta...</span>
            </div>
          ) : (
            "Crear Cuenta"
          )}
        </Button>
      </form>
    </div>
  )
} 
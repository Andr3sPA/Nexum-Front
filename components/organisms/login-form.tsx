"use client"

import React, { useState } from "react"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { FormField } from "@/components/molecules/form-field"
import { Alert, AlertDescription } from "@/components/atoms/alert"
import { NexumLogo } from "@/components/molecules/nexum-logo"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { logger } from "@/lib/logging"

export interface LoginFormData {
  email: string
  password: string
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  error?: string | null
  success?: string | null
  isLoading?: boolean
  showRegisterLink?: boolean
  registerLinkHref?: string
  registerLinkText?: string
}

export function LoginForm({
  onSubmit,
  error,
  success,
  isLoading = false,
  showRegisterLink = true,
  registerLinkHref = "/register",
  registerLinkText = "Regístrate aquí"
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await onSubmit(formData)
    } catch (error) {
      logger.error("❌ LoginForm.handleSubmit error:", error)
    }
  }

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-6">
          <NexumLogo size="lg" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
        <p className="text-gray-600">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      {/* Account Creation Link */}
      {showRegisterLink && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <a 
              href={registerLinkHref} 
              className="font-medium text-[#026937] hover:text-[#35944b] transition-colors duration-200 hover:underline"
            >
              {registerLinkText}
            </a>
          </p>
        </div>
      )}

      {/* Alerts */}
      {success && (
        <Alert variant="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField id="email" label="Correo Electrónico" required>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  logger.info("🔤 Enter pressed in email field")
                }
              }}
              placeholder="tu@correo.com"
              className="pl-10"
              required
              disabled={isLoading}
            />
          </div>
        </FormField>

        <FormField id="password" label="Contraseña" required>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  logger.info("🔤 Enter pressed in password field")
                }
              }}
              placeholder="••••••••"
              className="pl-10 pr-10"
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

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isLoading}
          onClick={() => logger.info("🔘 Login button clicked")}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Iniciando sesión...</span>
            </div>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </form>

      {/* Forgot Password */}
      <div className="text-center">
        <a 
          href="/forgot-password" 
          className="text-sm font-medium text-[#026937] hover:text-[#35944b] transition-colors duration-200 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  )
} 
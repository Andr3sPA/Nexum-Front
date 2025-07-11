"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Select } from "@/components/atoms/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { AuthenticationService } from "@/lib/services/profile/auth.service"
import { IdentityDocumentTypeService, IdentityDocumentTypeResponse } from "@/lib/services/catalog/identity-document-type.service"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
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
    confirmPassword: "",
    role: "egresado", // Default role is always egresado
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [documentTypes, setDocumentTypes] = useState<IdentityDocumentTypeResponse[]>([])

  React.useEffect(() => {
    IdentityDocumentTypeService.getAll().then(setDocumentTypes).catch(() => setDocumentTypes([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      console.log("Registro exitoso, redirigiendo...");
      router.push("/login?success=1");
      console.log("Redirección ejecutada");
    } catch (err: any) {
      setError(err.message || "Error al registrarse")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center udea-primary-text">Registro de Egresados</CardTitle>
          <CardDescription className="text-center">
            Completa la información para crear tu cuenta como egresado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idType">Tipo de Identificación *</Label>
                <Select value={formData.idType} onChange={(e) => handleInputChange("idType", e.target.value)}>
                  <option value="">Seleccionar</option>
                  {documentTypes.map((type) => (
                    <option key={type.id} value={String(type.id)}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">Número de Identificación *</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">Primer Nombre *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondName">Segundo Nombre</Label>
                <Input
                  id="secondName"
                  value={formData.secondName}
                  onChange={(e) => handleInputChange("secondName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstLastName">Primer Apellido *</Label>
                <Input
                  id="firstLastName"
                  value={formData.firstLastName}
                  onChange={(e) => handleInputChange("firstLastName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondLastName">Segundo Apellido</Label>
                <Input
                  id="secondLastName"
                  value={formData.secondLastName}
                  onChange={(e) => handleInputChange("secondLastName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Género *</Label>
                <Select value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)}>
                  <option value="">Seleccionar género</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="No binario">No binario</option>
                  <option value="Otro">Otro</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full udea-primary">
              Registrarse como Egresado
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="udea-primary-text hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

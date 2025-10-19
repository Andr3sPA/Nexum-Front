"use client"

import React, { useState } from "react"
import AuthTemplate from "@/components/templates/auth-template"
import { Input } from "@/components/atoms/input"
import { Button } from "@/components/atoms/button"
import { AuthenticationService } from "@/lib/services/profile/auth.service"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/molecules/card"
import { FormField } from "@/components/molecules/form-field"
import { Mail } from "lucide-react"

export default function RequestPasswordResetPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRequest = async () => {
    setLoading(true)
    try {
      await AuthenticationService.requestPasswordReset(email)
      toast({ title: "Correo enviado", description: "Si existe una cuenta verificada, recibirás un correo para restablecer la contraseña", type: "success" })
      router.push("/login")
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "No se pudo solicitar el restablecimiento", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthTemplate variant="login">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center">
            <Mail className="w-10 h-10 text-[#026937]" />
          </div>
          <CardTitle className="text-center">Restablecer contraseña</CardTitle>
          <CardDescription className="text-center">Ingresa el correo asociado a tu cuenta y te enviaremos un enlace o código para restablecer la contraseña.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleRequest() }} className="space-y-4">
            <FormField id="email" label="Correo electrónico" required>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
              </div>
            </FormField>
          </form>
        </CardContent>

        <CardFooter>
          <div className="w-full">
            <Button onClick={handleRequest} disabled={loading} className="w-full h-12 text-base font-semibold">
              {loading ? 'Enviando...' : 'Solicitar restablecimiento'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </AuthTemplate>
  )
}

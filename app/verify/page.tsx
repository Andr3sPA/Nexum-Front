"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AuthTemplate from "@/components/templates/auth-template"
import { Input } from "@/components/atoms/input"
import { Button } from "@/components/atoms/button"
import { AuthenticationService } from "@/lib/services/profile/auth.service"
import { toast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/molecules/card"
import { FormField } from "@/components/molecules/form-field"
import { Key, Mail } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenFromQuery = searchParams.get("token") || ""
  const emailFromQuery = searchParams.get("email") || ""

  const [email, setEmail] = useState(emailFromQuery)
  const [token, setToken] = useState(tokenFromQuery)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'email' | 'code'>('email') // 'email' for getting code, 'code' for verifying

  useEffect(() => {
    if (tokenFromQuery && emailFromQuery) {
      // If both are in query, go directly to verify
      setStep('code')
      handleVerify(emailFromQuery, tokenFromQuery)
    } else if (emailFromQuery) {
      // If only email, auto-send verification code
      setEmail(emailFromQuery)
      handleGetCodeAuto(emailFromQuery)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGetCodeAuto = async (em: string) => {
    setLoading(true)
    setError(null)
    try {
      await AuthenticationService.resendVerification(em)
      // No toast here, since it's automatic
      setStep('code')
    } catch (err: any) {
      setError(err.message || "Error enviando código")
      toast({ title: "Error", description: err?.message || "No se pudo enviar el código", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleGetCode = async () => {
    if (!email) {
      setError("Ingresa tu correo electrónico")
      return
    }
    setLoading(true)
    setError(null)
    try {
      await AuthenticationService.resendVerification(email)
      toast({ title: "Código enviado", description: "Revisa tu correo para el código de verificación", type: "success" })
      setStep('code')
    } catch (err: any) {
      setError(err.message || "Error enviando código")
      toast({ title: "Error", description: err?.message || "No se pudo enviar el código", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (em?: string, tkn?: string) => {
    const actualEmail = em ?? email
    const actualToken = tkn ?? token
    setLoading(true)
    setError(null)
    try {
      await AuthenticationService.verifyAccount(actualEmail, actualToken)
      toast({ title: "Cuenta verificada", description: "Tu cuenta fue verificada correctamente", type: "success" })
      router.push("/login")
    } catch (err: any) {
      setError(err.message || "Error al verificar")
      toast({ title: "Error", description: err?.message || "No se pudo verificar la cuenta", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthTemplate variant="login">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center">
            <Key className="w-10 h-10 text-[#026937]" />
          </div>
          <CardTitle className="text-center">Verificar cuenta</CardTitle>
          <CardDescription className="text-center">
            {step === 'email' ? "Ingresa tu correo electrónico para obtener el código de verificación." : "Ingresa el código que te fue enviado por correo."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); step === 'email' ? handleGetCode() : handleVerify() }} className="space-y-4">
            <FormField id="email" label="Correo electrónico" required>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={step === 'code' || loading}
                />
              </div>
            </FormField>

            {step === 'code' && (
              <FormField id="token" label="Código de verificación" required>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="token"
                    placeholder="Código"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </FormField>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}
          </form>
        </CardContent>

        <CardFooter>
          <div className="w-full">
            {step === 'email' ? (
              <Button onClick={handleGetCode} disabled={loading} className="w-full h-12 text-base font-semibold">
                {loading ? 'Enviando...' : 'Obtener código'}
              </Button>
            ) : (
              <Button onClick={() => handleVerify()} disabled={loading} className="w-full h-12 text-base font-semibold">
                {loading ? 'Verificando...' : 'Verificar código'}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </AuthTemplate>
  )
}

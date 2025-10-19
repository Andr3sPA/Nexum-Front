"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AuthTemplate from "@/components/templates/auth-template"
import { Input } from "@/components/atoms/input"
import { Button } from "@/components/atoms/button"
import { AuthenticationService } from "@/lib/services/profile/auth.service"
import { toast } from "@/hooks/use-toast"

export default function ResetPasswordPage({ params }: { params: { token?: string } }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Next 13 dynamic route: token will be available in params
  // But to support links with query '?token=' we also read it
  useEffect(() => {
    // no-op here; params are passed by Next automatically
  }, [])

  const token = (params && params.token) || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") || undefined : undefined)

  const handleReset = async () => {
    setLoading(true)
    setError(null)
    if (!token) {
      setError("Token no proporcionado")
      setLoading(false)
      return
    }
    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      await AuthenticationService.resetPassword(token, password)
      toast({ title: "Contraseña restablecida", description: "Ahora puedes iniciar sesión con tu nueva contraseña", type: "success" })
      router.push("/login")
    } catch (err: any) {
      setError(err?.message || "Error al restablecer la contraseña")
      toast({ title: "Error", description: err?.message || "No se pudo restablecer la contraseña", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthTemplate variant="login">
      <div className="space-y-4 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold">Cambiar contraseña</h2>
        <p className="text-sm text-gray-600">Ingresa tu nueva contraseña.</p>

        <Input placeholder="Nueva contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input placeholder="Confirmar contraseña" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {error && <div className="text-sm text-red-600">{error}</div>}

        <Button onClick={handleReset} disabled={loading} className="w-full">{loading ? 'Restableciendo...' : 'Restablecer contraseña'}</Button>
      </div>
    </AuthTemplate>
  )
}

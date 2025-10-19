"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import AuthTemplate from "@/components/templates/auth-template"
import { Input } from "@/components/atoms/input"
import { Button } from "@/components/atoms/button"
import { AuthenticationService } from "@/lib/services/profile/auth.service"
import { toast } from "@/hooks/use-toast"

export default async function ResetPasswordPage({ params }: { params: Promise<{ token?: string }> }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Await params since they are now async in Next.js 13+
  const resolvedParams = await params;
  const token = resolvedParams.token || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") || undefined : undefined)

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

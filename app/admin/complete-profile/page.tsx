"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import ProfileTabs from "@/components/profile-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function CompleteProfileContent() {
  const searchParams = useSearchParams()
  const graduateId = searchParams.get("graduateId")
  const isNewUser = searchParams.get("newUser") === "true"

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {isNewUser && (
              <Card className="mb-6 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Egresado Registrado Exitosamente</CardTitle>
                  <CardDescription className="text-green-700">
                    El egresado ha sido registrado con los datos básicos. Complete la información adicional en las
                    siguientes pestañas.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold udea-primary-text">Completar Perfil del Egresado</CardTitle>
                <CardDescription>
                  Complete toda la información del perfil del egresado en las siguientes secciones.
                  {graduateId && (
                    <span className="block mt-2 text-sm text-gray-500">ID del Egresado: {graduateId}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileTabs />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CompleteProfileContent />
    </Suspense>
  )
}

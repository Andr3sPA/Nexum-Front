"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import ProfileTabs from "@/components/profile-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { DetailedUserService, DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"
import { logger } from "@/lib/logging"

function CompleteProfileContent() {
  const searchParams = useSearchParams()
  const graduateId = searchParams.get("graduateId")
  const isNewUser = searchParams.get("newUser") === "true"
  const [detailedUser, setDetailedUser] = useState<DetailedUserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  const user = LocalStorageService.getItem<any>("user")

  // Try to load detailed user profile if graduateId is provided and not a new user
  useEffect(() => {
    if (graduateId && !isNewUser) {
      const fetchDetailedUser = async () => {
        try {
          setIsLoading(true)
          setError(null)

          const userData = await DetailedUserService.getById(graduateId)
          setDetailedUser(userData)
        } catch (error) {
          logger.error("Error fetching detailed user profile:", error)
          setError("Error al cargar el perfil detallado")
          // Don't set detailedUser to null, let it use the basic profile
        } finally {
          setIsLoading(false)
        }
      }

      fetchDetailedUser()
    }
  }, [graduateId, isNewUser])

  // Use detailed user data if available, otherwise fall back to basic profile
  const profileData = detailedUser || userProfile
  
  const firstName = profileData?.name?.split(" ")[0] || ""
  const firstLastname = profileData?.lastname?.split(" ")[0] || ""
  const email = profileData?.institutionalEmail || user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")

  return (
    <>
      <Navbar user={{
        firstName,
        firstLastname,
        email,
        role: user?.role,
        initials,
        ...profileData
      }} />
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
                {isLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando perfil...</p>
                  </div>
                )}
                {error && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Nota:</strong> {error}. Se mostrará un perfil básico para completar.
                    </p>
                  </div>
                )}
                <ProfileTabs userProfile={profileData} />
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

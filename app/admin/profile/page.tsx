"use client"

import { useSearchParams } from "next/navigation"
import { useUserProfile } from "@/hooks/use-user-profile"
import Navbar from "@/components/navbar"
import ProfileTabs from "@/components/profile-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  
  const {
    detailedUser,
    userProfile,
    user,
    isLoading,
    error,
    isCurrentUser,
    canEdit,
    refreshData
  } = useUserProfile({
    userId: userId || undefined,
    isViewOnly: false, // Admins can edit
    redirectOnUnauthorized: true
  })

  // Use detailed user data for navbar
  const firstName = detailedUser?.name?.split(" ")[0] || userProfile?.name?.split(" ")[0] || ""
  const firstLastname = detailedUser?.lastname?.split(" ")[0] || userProfile?.lastname?.split(" ")[0] || ""
  const email = detailedUser?.institutionalEmail || user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")

  if (isLoading) {
    return (
      <>
        <Navbar user={{
          firstName,
          firstLastname,
          email,
          role: user?.role,
          initials,
          ...userProfile
        }} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar user={{
          firstName,
          firstLastname,
          email,
          role: user?.role,
          initials,
          ...userProfile
        }} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">Error</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => router.back()}
              className="mt-4"
            >
              Volver
            </Button>
          </div>
        </div>
      </>
    )
  }

  if (!detailedUser) {
    return (
      <>
        <Navbar user={{
          firstName,
          firstLastname,
          email,
          role: user?.role,
          initials,
          ...userProfile
        }} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-600 text-xl mb-4">No se pudo cargar el perfil</div>
            <Button 
              onClick={() => router.back()}
              className="mt-4"
            >
              Volver
            </Button>
          </div>
        </div>
      </>
    )
  }

  const profileTitle = isCurrentUser ? "Mi Perfil" : `Perfil de ${detailedUser.name} ${detailedUser.lastname}`
  const profileDescription = isCurrentUser 
    ? "Actualiza tu información personal, académica y laboral"
    : "Información personal, académica y laboral del egresado"

  return (
    <>
      <Navbar user={{
        firstName,
        firstLastname,
        email,
        role: user?.role,
        initials,
        ...detailedUser
      }} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Back button for admin */}
            {!isCurrentUser && (
              <div className="mb-4">
                <Button 
                  variant="ghost" 
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a la búsqueda
                </Button>
              </div>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold udea-primary-text">{profileTitle}</CardTitle>
                <CardDescription>{profileDescription}</CardDescription>
                {!isCurrentUser && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">
                      Modo de administración - Edición habilitada
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ProfileTabs 
                  userProfile={{ ...detailedUser, email: user?.email }} 
                  isViewOnly={false} // Admins can always edit
                  onDataUpdate={refreshData}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
} 
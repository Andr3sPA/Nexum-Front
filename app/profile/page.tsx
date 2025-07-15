"use client"

import { useSearchParams } from "next/navigation"
import { useUserProfile } from "@/hooks/use-user-profile"
import Navbar from "@/components/navbar"
import ProfileTabs from "@/components/profile-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"

export default function ProfilePage() {
  console.log("📄 ProfilePage rendered")
  
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  
  console.log("📄 ProfilePage - userId from searchParams:", userId)
  
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
    userId: userId || undefined
  })

  console.log("📄 ProfilePage - hook data:", { 
    hasDetailedUser: !!detailedUser, 
    hasUserProfile: !!userProfile, 
    hasUser: !!user, 
    isLoading, 
    error, 
    isCurrentUser, 
    canEdit 
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
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Volver
            </button>
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
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Volver
            </button>
          </div>
        </div>
      </>
    )
  }

  const profileTitle = isCurrentUser ? "Mi Perfil" : `Perfil de ${detailedUser.name} ${detailedUser.lastname}`
  const profileDescription = isCurrentUser 
    ? "Actualiza tu información personal, académica y laboral"
    : "Información personal, académica y laboral"

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
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold udea-primary-text">{profileTitle}</CardTitle>
                <CardDescription>{profileDescription}</CardDescription>
                {!isCurrentUser && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">
                      {canEdit ? "Modo de edición habilitado" : "Modo de solo lectura"}
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ProfileTabs 
                  userProfile={{ ...detailedUser, email: user?.email }} 
                  isViewOnly={!canEdit}
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

"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useUserProfile } from "@/hooks/use-user-profile"
import Navbar from "@/components/navbar"
import ProfileTabs from "@/components/profile-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { Button } from "@/components/atoms/button"
import { ArrowLeft } from "lucide-react"
import { AuthProvider, useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  return (
    <AuthProvider>
      <ProfilePageContent />
    </AuthProvider>
  );
}

function ProfilePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const { user } = useAuth()

  const {
    detailedUser,
    userProfile,
    isLoading,
    error,
    isCurrentUser,
    refreshData
  } = useUserProfile({
    userId: userId || undefined,
    isViewOnly: false,
    redirectOnUnauthorized: true
  })

  // Permisos de edición
  const normalizedRole = (user?.role || "").toUpperCase()
  const canEdit = isCurrentUser || (normalizedRole === "ADMINISTRATIVE" || normalizedRole === "ADMIN")

  // Use current user data for navbar (always from localStorage)
  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
  const email = user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")

  if (isLoading) {
    return (
      <>
        {user && userProfile && (
          <Navbar user={{
            name: userProfile.name,
            lastname: userProfile.lastname,
            email: user.email,
            role: user.role,
            initials: user.initials,
            firstName: userProfile.name?.split(' ')[0] || '',
            firstLastname: userProfile.lastname?.split(' ')[0] || '',
            ...userProfile
          }} />
        )}
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
        {user && userProfile && (
          <Navbar user={{
            name: userProfile.name,
            lastname: userProfile.lastname,
            email: user.email,
            role: user.role,
            initials: user.initials,
            firstName: userProfile.name?.split(' ')[0] || '',
            firstLastname: userProfile.lastname?.split(' ')[0] || '',
            ...userProfile
          }} />
        )}
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
        {user && userProfile && (
          <Navbar user={{
            name: userProfile.name,
            lastname: userProfile.lastname,
            email: user.email,
            role: user.role,
            initials: user.initials,
            firstName: userProfile.name?.split(' ')[0] || '',
            firstLastname: userProfile.lastname?.split(' ')[0] || '',
            ...userProfile
          }} />
        )}
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
      {user && userProfile && (
        <Navbar user={{
          name: userProfile.name,
          lastname: userProfile.lastname,
          email: user.email,
          role: user.role,
          initials: user.initials,
          firstName: userProfile.name?.split(' ')[0] || '',
          firstLastname: userProfile.lastname?.split(' ')[0] || '',
          ...userProfile
        }} />
      )}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Back button for admin/dean when viewing another user's profile */}
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
                <CardTitle className="text-2xl font-bold udea-primary-text">{isCurrentUser ? "Mi Perfil" : `Perfil de ${detailedUser?.name} ${detailedUser?.lastname}`}</CardTitle>
                <CardDescription>{isCurrentUser 
                  ? "Actualiza tu información personal, académica y laboral"
                  : "Información personal, académica y laboral del egresado"}
                </CardDescription>

              </CardHeader>
               <CardContent>
                 <ProfileTabs
                   userProfile={{ ...detailedUser, email: user?.email }}
                   isViewOnly={!canEdit}
                   onDataUpdate={refreshData}
                   currentUserRole={user?.role}
                 />
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

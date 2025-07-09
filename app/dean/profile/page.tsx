"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { DetailedUserService, DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"
import { ROLES } from "@/lib/services/constants/api.constants"
import { ROUTES } from "@/lib/routes"
import Navbar from "@/components/navbar"
import ProfileTabs from "@/components/profile-tabs"
import { logger } from "@/lib/logging"

export default function DeanProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [detailedUser, setDetailedUser] = useState<DetailedUserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get user info from localStorage
  const userProfile = LocalStorageService.getItem<any>("userProfile")
  const user = LocalStorageService.getItem<any>("user")
  const currentUserId = user?.id

  // Get target user ID from URL params
  const targetUserId = searchParams.get("userId")

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !targetUserId || targetUserId === currentUserId?.toString()
  const userIdToFetch = isOwnProfile ? currentUserId : targetUserId

  const firstName = userProfile?.name?.split(" ")[0] || ""
  const firstLastname = userProfile?.lastname?.split(" ")[0] || ""
  const email = user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")

  useEffect(() => {
    // Check if user is dean
    if (!userProfile || userProfile.role !== ROLES.DEAN) {
      router.replace("/login")
      return
    }

    const fetchUserProfile = async () => {
      if (!userIdToFetch) {
        setError("ID de usuario no válido")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const userData = await DetailedUserService.getById(userIdToFetch)
        setDetailedUser(userData)
      } catch (error) {
        logger.error("Error fetching user profile:", error)
        setError("Error al cargar el perfil del usuario")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [userIdToFetch, userProfile, router])

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
              onClick={() => router.back()}
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
            <div className="text-gray-600 text-xl mb-4">Usuario no encontrado</div>
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Volver
            </button>
          </div>
        </div>
      </>
    )
  }

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header with back button if viewing another user's profile */}
            {!isOwnProfile && (
              <div className="mb-6">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver a la búsqueda
                </button>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Viendo perfil de:</strong> {detailedUser.name} {detailedUser.lastname}
                  </p>
                </div>
              </div>
            )}

            <ProfileTabs userProfile={detailedUser} />
          </div>
        </div>
      </div>
    </>
  )
} 
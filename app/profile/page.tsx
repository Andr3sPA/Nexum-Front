"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { DetailedUserService, DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"
import { ROLES } from "@/lib/services/constants/api.constants"
import { ROUTES } from "@/lib/routes"
import Navbar from "@/components/navbar"
import ProfileTabs from "@/components/profile-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/molecules/card"
import { logger } from "@/lib/logging"

export default function ProfilePage() {
  const router = useRouter()
  const [detailedUser, setDetailedUser] = useState<DetailedUserResponse | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false)
  const hasFetched = useRef(false)

  // Load user data from localStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserProfile = LocalStorageService.getItem<any>("userProfile")
      const storedUser = LocalStorageService.getItem<any>("user")
      setUserProfile(storedUserProfile)
      setUser(storedUser)
      setHasLoadedFromStorage(true)
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedFromStorage) return // Wait for localStorage to load

    if (!userProfile) {
      router.replace("/login")
      return
    }
    
    const userRole = userProfile?.role
    
    // Redirect admins and deans to their respective profile pages
    if (userRole === ROLES.ADMINISTRATIVE) {
      router.replace(ROUTES.ADMIN.VIEW_PROFILE)
      return
    }
    
    if (userRole === ROLES.DEAN) {
      router.replace(ROUTES.DEAN.VIEW_PROFILE)
      return
    }

    // Only fetch detailed user for graduates if not already fetched
    if (!hasFetched.current) {
      hasFetched.current = true
      
      const fetchDetailedUser = async () => {
        try {
          setIsLoading(true)
          setError(null)

          const userData = await DetailedUserService.getCurrentUserDetailed()
          setDetailedUser(userData)
        } catch (error) {
          logger.error("Error fetching detailed user profile:", error)
          setError("Error al cargar el perfil detallado")
        } finally {
          setIsLoading(false)
        }
      }

      fetchDetailedUser()
    }
  }, [userProfile, hasLoadedFromStorage, router])

  // Use detailed user data for navbar
  const firstName = detailedUser?.name?.split(" ")[0] || userProfile?.name?.split(" ")[0] || ""
  const firstLastname = detailedUser?.lastname?.split(" ")[0] || userProfile?.lastname?.split(" ")[0] || ""
  const email = detailedUser?.institutionalEmail || user?.email || ""
  const initials = user?.initials || (firstName[0] || "") + (firstLastname[0] || "")

  // Show loading while localStorage is being checked
  if (!hasLoadedFromStorage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

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
            <div className="text-gray-600 text-xl mb-4">No se pudo cargar el perfil</div>
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
        ...detailedUser
      }} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold udea-primary-text">Mi Perfil</CardTitle>
                <CardDescription>Actualiza tu información personal, académica y laboral</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileTabs userProfile={{ ...detailedUser, email: user?.email }} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { DetailedUserService, DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"
import { ROLES } from "@/lib/services/constants/api.constants"
import { ROUTES } from "@/lib/routes"
import { logger } from "@/lib/logging"

interface UseUserProfileOptions {
  userId?: string
  isViewOnly?: boolean
  redirectOnUnauthorized?: boolean
}

interface UseUserProfileReturn {
  detailedUser: DetailedUserResponse | null
  userProfile: any
  user: any
  isLoading: boolean
  error: string | null
  isCurrentUser: boolean
  canEdit: boolean
  refreshData: () => Promise<void>
}

export function useUserProfile({
  userId,
  isViewOnly = false,
  redirectOnUnauthorized = true
}: UseUserProfileOptions = {}): UseUserProfileReturn {
  console.log("👤 useUserProfile hook initialized with:", { userId, isViewOnly, redirectOnUnauthorized })
  
  const router = useRouter()
  const [detailedUser, setDetailedUser] = useState<DetailedUserResponse | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false)
  const hasFetched = useRef(false)

  // Load current user data from localStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserProfile = LocalStorageService.getItem<any>("userProfile")
      const storedUser = LocalStorageService.getItem<any>("user")
      setUserProfile(storedUserProfile)
      setUser(storedUser)
      setHasLoadedFromStorage(true)
    }
  }, [])

  // Determine if we're viewing the current user's profile
  const currentUserId = userProfile?.id || user?.id
  const isCurrentUser = !userId || userId === currentUserId
  const targetUserId = userId || currentUserId

  // Determine if the current user can edit this profile
  const canEdit = isCurrentUser || 
    (user?.role === ROLES.ADMINISTRATIVE || user?.role === ROLES.DEAN) && !isViewOnly

  useEffect(() => {
    if (!hasLoadedFromStorage) return // Wait for localStorage to load

    // Check if current user is authenticated
    if (!userProfile && redirectOnUnauthorized) {
      router.replace("/login")
      return
    }

    // Handle role-based redirects for current user's own profile
    if (isCurrentUser) {
      const userRole = userProfile?.role
      
      if (userRole === ROLES.ADMINISTRATIVE) {
        router.replace(ROUTES.ADMIN.VIEW_PROFILE)
        return
      }
      
      if (userRole === ROLES.DEAN) {
        router.replace(ROUTES.DEAN.VIEW_PROFILE)
        return
      }
    }

    // Fetch detailed user data if not already fetched
    if (!hasFetched.current && targetUserId) {
      hasFetched.current = true
      
      const fetchDetailedUser = async () => {
        try {
          console.log("🔄 Starting to fetch detailed user...", { targetUserId, isCurrentUser })
          setIsLoading(true)
          setError(null)

          let userData: DetailedUserResponse

          if (isCurrentUser) {
            // Fetch current user's detailed profile
            console.log("📡 Calling DetailedUserService.getCurrentUserDetailed()...")
            userData = await DetailedUserService.getCurrentUserDetailed()
          } else {
            // Fetch another user's profile (for admins/deans)
            console.log("📡 Calling DetailedUserService.getById()...")
            userData = await DetailedUserService.getById(targetUserId)
          }

          console.log("✅ Detailed user data received:", userData)
          setDetailedUser(userData)
        } catch (error) {
          console.error("❌ Error fetching detailed user profile:", error)
          logger.error("Error fetching detailed user profile:", error)
          setError("Error al cargar el perfil detallado")
        } finally {
          console.log("🏁 Finished fetching detailed user")
          setIsLoading(false)
        }
      }

      fetchDetailedUser()
    }
  }, [userProfile, hasLoadedFromStorage, router, targetUserId, isCurrentUser, redirectOnUnauthorized])

  const refreshData = async () => {
    if (!targetUserId) return

    try {
      setIsLoading(true)
      setError(null)

      let userData: DetailedUserResponse

      if (isCurrentUser) {
        userData = await DetailedUserService.getCurrentUserDetailed()
      } else {
        userData = await DetailedUserService.getById(targetUserId)
      }

      setDetailedUser(userData)
    } catch (error) {
      console.error("Error refreshing user data:", error)
      logger.error("Error refreshing user data:", error)
      setError("Error al actualizar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    detailedUser,
    userProfile,
    user,
    isLoading,
    error,
    isCurrentUser,
    canEdit,
    refreshData
  }
} 
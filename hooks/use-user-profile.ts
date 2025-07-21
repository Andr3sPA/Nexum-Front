"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { DetailedUserService, DetailedUserResponse } from "@/lib/services/profile/detailed-user.service"
import { ROLES } from "@/lib/services/constants/api.constants"
import { ROUTES } from "@/lib/routes"
import { logger } from "@/lib/logging"
import { UserService, UserResponse } from "@/lib/services/profile/user.service"

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
  // Elimina los console.log de debug
  
  const router = useRouter()
  const [detailedUser, setDetailedUser] = useState<DetailedUserResponse | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  // Fetch authenticated user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const authenticatedUser = await UserService.getCurrentUser()
        setUser(authenticatedUser)
        setUserProfile(authenticatedUser) // Opcional: si quieres que userProfile sea igual al usuario base
      } catch (err) {
        setUser(null)
        setUserProfile(null)
        setError("No autenticado")
        if (redirectOnUnauthorized) {
          router.replace("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [redirectOnUnauthorized, router])

  // Determine if we're viewing the current user's profile
  const currentUserId = user?.id
  const isCurrentUser = !userId || userId === currentUserId
  const targetUserId = userId || currentUserId

  // Determine if the current user can edit this profile
  const canEdit = isCurrentUser || ((user?.role === ROLES.ADMINISTRATIVE || user?.role === ROLES.DEAN) && !isViewOnly)

  useEffect(() => {
    // No need for role-based redirects since we have a unified profile page
    // All users can access their profile through /profile

    // Fetch detailed user data if not already fetched and user is authenticated
    if (!hasFetched.current && targetUserId && user) {
      hasFetched.current = true
      
      const fetchDetailedUser = async () => {
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
          setError("Error al cargar el perfil detallado")
        } finally {
          setIsLoading(false)
        }
      }

      fetchDetailedUser()
    }
  }, [user, targetUserId, isCurrentUser])

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